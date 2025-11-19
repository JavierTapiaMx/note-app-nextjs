import { describe, it, expect, beforeEach } from "vitest";
import { PATCH } from "@/app/api/notes/[id]/route";
import { noteRepository } from "@/services/noteRepository";
import { createTestNoteData } from "../../../helpers/testData";
import { NextRequest } from "next/server";
import "../../setup";

describe("PATCH /api/notes/:id - Update Note Integration", () => {
  let testNoteId: number;

  beforeEach(async () => {
    const noteData = createTestNoteData({
      title: "Original Title",
      content: "Original content"
    });
    testNoteId = await noteRepository.create(noteData);
  });

  describe("successful update", () => {
    it("should update both title and content with valid data", async () => {
      const updateData = {
        title: "[TEST] Updated Title",
        content: "Updated content"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(testNoteId);
      expect(data.title).toBe(updateData.title);
      expect(data.content).toBe(updateData.content);
      expect(data).toHaveProperty("updatedAt");
    });

    it("should update only the title", async () => {
      const originalNote = await noteRepository.findById(testNoteId);
      const updateData = {
        title: "[TEST] Only Title Updated"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(updateData.title);
      expect(data.content).toBe(originalNote?.content);
    });

    it("should update only the content", async () => {
      const originalNote = await noteRepository.findById(testNoteId);
      const updateData = {
        content: "Only content updated"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(originalNote?.title);
      expect(data.content).toBe(updateData.content);
    });

    it("should persist the update in the database", async () => {
      const updateData = {
        title: "[TEST] Persistence Test Title",
        content: "Persistence test content"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const noteFromDb = await noteRepository.findById(testNoteId);

      expect(noteFromDb).not.toBeNull();
      expect(noteFromDb?.title).toBe(updateData.title);
      expect(noteFromDb?.content).toBe(updateData.content);
    });

    it("should handle special characters in updated fields", async () => {
      const updateData = {
        title: "[TEST] Special: @#$%^&*()",
        content: "Updated with\nnewlines\nand chars: <>?:|{}"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(updateData.title);
      expect(data.content).toBe(updateData.content);
    });

    it("should update updatedAt timestamp", async () => {
      const originalNote = await noteRepository.findById(testNoteId);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updateData = {
        title: "[TEST] Timestamp Test"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(new Date(data.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalNote!.updatedAt).getTime()
      );
    });
  });

  describe("validation errors", () => {
    it("should return 400 when title is empty string", async () => {
      const invalidData = {
        title: ""
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(invalidData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when content is empty string", async () => {
      const invalidData = {
        content: ""
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(invalidData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when title exceeds maximum length", async () => {
      const invalidData = {
        title: "a".repeat(256)
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(invalidData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when request body is invalid JSON", async () => {
      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: "invalid json {{{",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Invalid JSON in request body");
    });
  });

  describe("not found scenarios", () => {
    it("should return 404 when note does not exist", async () => {
      const nonExistentId = 999999;
      const updateData = {
        title: "[TEST] Update Non-existent"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${nonExistentId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: nonExistentId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Note not found");
    });

    it("should return 400 when id is not a valid number", async () => {
      const updateData = {
        title: "[TEST] Invalid ID"
      };

      const request = new NextRequest(
        "http://localhost:3000/api/notes/invalid",
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: "invalid" })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Invalid note Id");
    });
  });

  describe("edge cases", () => {
    it("should update title to minimum valid length (1 character)", async () => {
      const updateData = {
        title: "a"
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(updateData.title);
    });

    it("should update title to maximum valid length (255 characters)", async () => {
      const maxLengthTitle = `[TEST] ${"a".repeat(248)}`;
      const updateData = {
        title: maxLengthTitle
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe(maxLengthTitle);
      expect(data.title.length).toBe(255);
    });

    it("should update content to very long text", async () => {
      const longContent = "a".repeat(10000);
      const updateData = {
        content: longContent
      };

      const request = new NextRequest(
        `http://localhost:3000/api/notes/${testNoteId}`,
        {
          method: "PATCH",
          body: JSON.stringify(updateData)
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ id: testNoteId.toString() })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe(longContent);
    });
  });
});
