import httpMocks from "node-mocks-http";
import { User } from "../../src/models/User";
import { register, login } from "../../src/controllers/authController";

jest.mock("../../src/models/User", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

const mockedUser = User as jest.Mocked<any>;

describe("Auth Controller - register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if required fields are missing", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {}, // missing all fields
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await register(req as any, res as any, next as any);

    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data.message).toMatch(/Name, email and password are required/i);
  });

  test("should return 400 if email already exists", async () => {
    mockedUser.findOne.mockResolvedValueOnce({} as any); // pretend user exists

    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        name: "Test",
        email: "test@example.com",
        password: "password123",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await register(req as any, res as any, next as any);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(res.statusCode).toBe(400);
  });
});

describe("Auth Controller - login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return 400 if email or password is missing", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await login(req as any, res as any, next as any);

    expect(res.statusCode).toBe(400);
  });

  test("should return 400 if user not found", async () => {
    mockedUser.findOne.mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce(null),
    } as any);

    const req = httpMocks.createRequest({
      method: "POST",
      body: { email: "test@example.com", password: "password123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await login(req as any, res as any, next as any);

    expect(User.findOne).toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    const data = res._getJSONData();
    expect(data.message).toBe("Invalid credentials");
  });
});
