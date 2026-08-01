import bcrypt from "bcrypt";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authRepository = vi.hoisted(() => ({
  findUserByEmail: vi.fn(),
  createUser: vi.fn(),
}));

vi.mock("./auth.repository.js", () => authRepository);
vi.mock("../../utils/jwt.js", () => ({
  generateToken: vi.fn(() => "signed.jwt.token"),
}));

describe("auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hashes passwords when registering a user", async () => {
    const { registerService } = await import("./auth.service.js");
    authRepository.findUserByEmail.mockResolvedValue(null);
    authRepository.createUser.mockResolvedValue({ id: 1, email: "user@example.com" });

    await registerService({ email: "user@example.com", password: "secret123" });

    const hashedPassword = authRepository.createUser.mock.calls[0]![1];
    expect(hashedPassword).not.toBe("secret123");
    await expect(bcrypt.compare("secret123", hashedPassword)).resolves.toBe(true);
  });

  it("login returns a JWT cookie", async () => {
    const { loginController } = await import("./auth.controller.js");
    const hashedPassword = await bcrypt.hash("secret123", 10);
    authRepository.findUserByEmail.mockResolvedValue({
      id: 1,
      email: "user@example.com",
      password: hashedPassword,
    });
    const req = { body: { email: "user@example.com", password: "secret123" } };
    const res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    const next = vi.fn();

    await loginController(req as never, res as never, next);

    expect(res.cookie).toHaveBeenCalledWith(
      "accessToken",
      "signed.jwt.token",
      expect.objectContaining({ httpOnly: true, sameSite: "lax" })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid credentials", async () => {
    const { loginService } = await import("./auth.service.js");
    authRepository.findUserByEmail.mockResolvedValue(null);

    await expect(
      loginService({ email: "missing@example.com", password: "secret123" })
    ).rejects.toMatchObject({
      statusCode: 401,
      message: "Invalid email or password",
    });
  });
});
