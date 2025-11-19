import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/notes/route";
import { noteRepository } from "@/services/noteRepository";
import { createTestNoteData } from "../../../helpers/testData";
import { NextRequest } from "next/server";
import "../../setup";

describe("POST /api/notes - Create Note Integration", () => {
  describe("successful creation", () => {
    it("should create a note with valid data and return 201", async () => {
      const noteData = createTestNoteData({
        title: "Integration Test Note",
        content: "This is a test note for integration testing"
      });

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(noteData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty("id");
      expect(data.title).toBe(noteData.title);
      expect(data.content).toBe(noteData.content);
      expect(data).toHaveProperty("createdAt");
      expect(data).toHaveProperty("updatedAt");
    });

    it("should persist the note in the database", async () => {
      const noteData = createTestNoteData({
        title: "Persistence Test Note",
        content: "This note should be in the database"
      });

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(noteData)
      });

      const response = await POST(request);
      const createdNote = await response.json();

      const noteFromDb = await noteRepository.findById(createdNote.id);

      expect(noteFromDb).not.toBeNull();
      expect(noteFromDb?.title).toBe(noteData.title);
      expect(noteFromDb?.content).toBe(noteData.content);
    });

    it("should handle special characters in title and content", async () => {
      const noteData = createTestNoteData({
        title: "Special chars: @#$%^&*()",
        content: "Content with\nnewlines\nand special chars: <>?:|{}"
      });

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(noteData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(noteData.title);
      expect(data.content).toBe(noteData.content);
    });

    it("should accept title at maximum length (255 characters)", async () => {
      const maxLengthTitle = `[TEST] ${"a".repeat(248)}`;

      const noteData = {
        title: maxLengthTitle,
        content: "Content for max length title test"
      };

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(noteData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(maxLengthTitle);
      expect(data.title.length).toBe(255);
    });
  });

  describe("validation errors", () => {
    it("should return 400 when title is missing", async () => {
      const invalidData = {
        content: "Content without title"
      };

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(invalidData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when content is missing", async () => {
      const invalidData = createTestNoteData({
        title: "Title without content"
      });
      delete (invalidData as any).content;

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(invalidData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when title is empty string", async () => {
      const invalidData = {
        title: "",
        content: "Valid content"
      };

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(invalidData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when content is empty string", async () => {
      const invalidData = createTestNoteData({
        title: "Valid title",
        content: ""
      });

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(invalidData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when title exceeds maximum length", async () => {
      const tooLongTitle = "a".repeat(256);

      const invalidData = {
        title: tooLongTitle,
        content: "Valid content"
      };

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(invalidData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("errors");
    });

    it("should return 400 when request body is invalid JSON", async () => {
      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: "invalid json {{{",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Invalid JSON in request body");
    });
  });

  describe("edge cases", () => {
    it("should create note with minimum valid title (1 character)", async () => {
      const noteData = createTestNoteData({
        title: "a",
        content: "Content for minimum title test"
      });

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(noteData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(noteData.title);
    });

    it("should create note with very long content", async () => {
      const longContent = "a".repeat(10000);
      const noteData = createTestNoteData({
        title: "Long Content Test",
        content: longContent
      });

      const request = new NextRequest("http://localhost:3000/api/notes", {
        method: "POST",
        body: JSON.stringify(noteData)
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.content).toBe(longContent);
    });
  });
});
