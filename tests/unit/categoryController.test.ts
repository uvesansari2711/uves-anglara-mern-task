import httpMocks from "node-mocks-http";
import { Category } from "../../src/models/Category";
import {
  createCategory,
  deleteCategory,
} from "../../src/controllers/categoryController";

jest.mock("../../src/models/Category", () => ({
  Category: {
    findById: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    updateMany: jest.fn(),
    deleteOne: jest.fn(),
  },
}));

const mockedCategory = Category as jest.Mocked<any>;

describe("Category Controller - createCategory", () => {
  afterEach(() => jest.clearAllMocks());

  test("should return 400 if name is missing", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { parentId: "123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await createCategory(req as any, res as any, next as any);
    expect(res.statusCode).toBe(400);
  });

  test("should return 400 if parentId is invalid", async () => {
    mockedCategory.findById.mockResolvedValueOnce(null as any);

    const req = httpMocks.createRequest({
      method: "POST",
      body: { name: "Child", parentId: "123" },
    });
    const res = httpMocks.createResponse();

    const next = jest.fn();
    await createCategory(req as any, res as any, next as any);
    expect(res.statusCode).toBe(400);
  });
});

describe("Category Controller - deleteCategory", () => {
  afterEach(() => jest.clearAllMocks());

  test("should return 404 if category not found", async () => {
    mockedCategory.findById.mockResolvedValueOnce(null as any);

    const req = httpMocks.createRequest({
      method: "DELETE",
      params: { id: "123" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    await deleteCategory(req as any, res as any, next as any);
    expect(res.statusCode).toBe(404);
  });
});
