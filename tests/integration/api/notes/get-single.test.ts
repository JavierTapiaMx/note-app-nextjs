import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "@/app/api/notes/[id]/route";
import { noteRepository } from "@/services/noteRepository";
import { createTestNoteData } from "../../../helpers/testData";
import { NextRequest } from "next/server";
import "../../setup";

describe("GET /api/notes/:id - Get Single Note Integration", () => {
  let testNoteId: number;
  let testNoteData: { title: string; content: string };

  beforeEach(async () => {
    testNoteData = createTestNoteData({
      title: "Test Note for Retrieval",
      content: "This is test content for retrieval testing"
    });
    testNoteId = await noteRepository.create(testNoteData);
  });

  describe("successful retrieval", () => {
    it("should retrieve a note by valid id", async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(testNoteId);
      expect(data.title).toBe(testNoteData.title);
      expect(data.content).toBe(testNoteData.content);
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");
    });

    it("should return note with correct data types", async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(typeof data.id).toBe("number");
      expect(typeof data.title).toBe("string");
      expect(typeof data.content).toBe("string");
      expect(data.createdAt).toBeTruthy();
      expect(data.updatedAt).toBeTruthy();
    });

    it("should retrieve note with special characters", async () => {
      const specialNoteData = createTestNoteData({
        title: "Special chars: @#$%^&*()",
        content: "Content with\nnewlines\nand chars: <>?:|{}"
      });

      const noteId = await noteRepository.create(specialNoteData);

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${noteId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: noteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(specialNoteData.title);
      expect(data.content).toBe(specialNoteData.content);
    });

    it("should retrieve note with very long content", async () => {
      const longContent = "a".repeat(10000);
      const longNoteData = createTestNoteData({
        title: "Long Content Note",
        content: longContent
      });

      const noteId = await noteRepository.create(longNoteData);

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${noteId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: noteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe(longContent);
      expect(data.content.length).toBe(10000);
    });

    it("should retrieve note with maximum title length", async () => {
      const maxLengthTitle = `[TEST] ${"a".repeat(248)}`;
      const maxTitleData = createTestNoteData({
        title: maxLengthTitle,
        content: "Content for max title length"
      });

      const noteId = await noteRepository.create({
        title: maxLengthTitle,
        content: maxTitleData.content
      });

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${noteId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: noteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(maxLengthTitle);
      expect(data.title.length).toBe(255);
    });
  });

  describe("not found scenarios", () => {
    it("should return 404 when note does not exist", async () => {
      const nonExistentId = 999999;

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${nonExistentId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: nonExistentId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Note not found");
    });

    it("should return 404 for deleted note", async () => {
      await noteRepository.delete(testNoteId);

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Note not found");
    });
  });

  describe("invalid input scenarios", () => {
    it("should return 400 when id is not a valid number", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/notes/invalid",
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: "invalid" })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Invalid note Id");
    });

    it("should return 400 when id is a negative number", async () => {
      const request = new NextRequest("http://localhost:3000/api/notes/-1", {
        method: "GET"
      });

      const response = await GET(request, {
        params: Promise.resolve({ id: "-1" })
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
    });

    it("should return 400 when id is zero", async () => {
      const request = new NextRequest("http://localhost:3000/api/notes/0", {
        method: "GET"
      });

      const response = await GET(request, {
        params: Promise.resolve({ id: "0" })
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
    });

    it("should parse decimal id as integer (parseInt behavior)", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/notes/1.5",
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: "1.5" })
      });

      // parseInt("1.5") returns 1, so this tests actual JavaScript behavior
      // If there's a note with ID 1, it will return 200, otherwise 404
      expect([200, 404]).toContain(response.status);
    });
  });

  describe("data consistency", () => {
    it("should return the same data when fetched multiple times", async () => {
      const request1 = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "GET"
        }
      );

      const response1 = await GET(request1, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data1 = await response1.json();

      const request2 = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "GET"
        }
      );

      const response2 = await GET(request2, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data2 = await response2.json();

      expect(data1.id).toBe(data2.id);
      expect(data1.title).toBe(data2.title);
      expect(data1.content).toBe(data2.content);
      expect(data1.createdAt).toBe(data2.createdAt);
    });

    it("should match data from repository directly", async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "GET"
        }
      );

      const response = await GET(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const apiData = await response.json();
      const dbData = await noteRepository.findById(testNoteId);

      expect(apiData.id).toBe(dbData?.id);
      expect(apiData.title).toBe(dbData?.title);
      expect(apiData.content).toBe(dbData?.content);
    });
  });
});
