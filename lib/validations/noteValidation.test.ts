import { describe, it, expect } from "vitest";
import {
  noteFormSchema,
  noteSchema,
  createNoteSchema,
  updateNoteSchema,
  VALIDATION_RULES,
  VALIDATION_MESSAGES
} from "./noteValidation";

describe("Note Form Validation", () => {
  describe("noteFormSchema", () => {
    describe("title validation", () => {
      it("should pass with valid title", () => {
        const validData = {
          title: "Valid Title",
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it("should fail when title is empty", () => {
        const invalidData = {
          title: "",
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            VALIDATION_MESSAGES.TITLE_REQUIRED
          );
        }
      });

      it("should fail when title exceeds maximum length", () => {
        const invalidData = {
          title: "a".repeat(VALIDATION_RULES.TITLE_MAX_LENGTH + 1),
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            VALIDATION_MESSAGES.TITLE_TOO_LONG
          );
        }
      });

      it("should pass when title is at maximum length", () => {
        const validData = {
          title: "a".repeat(VALIDATION_RULES.TITLE_MAX_LENGTH),
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it("should pass when title is at minimum length", () => {
        const validData = {
          title: "a",
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it("should trim whitespace from title before validation", () => {
        const dataWithWhitespace = {
          title: "  Valid Title  ",
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(dataWithWhitespace);
        expect(result.success).toBe(true);
      });
    });

    describe("content validation", () => {
      it("should pass with valid content", () => {
        const validData = {
          title: "Valid Title",
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it("should fail when content is empty", () => {
        const invalidData = {
          title: "Valid Title",
          content: ""
        };

        const result = noteFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            VALIDATION_MESSAGES.CONTENT_REQUIRED
          );
        }
      });

      it("should pass with long content", () => {
        const validData = {
          title: "Valid Title",
          content: "a".repeat(10000)
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it("should pass when content is at minimum length", () => {
        const validData = {
          title: "Valid Title",
          content: "a"
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });

    describe("edge cases", () => {
      it("should fail when both title and content are empty", () => {
        const invalidData = {
          title: "",
          content: ""
        };

        const result = noteFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues).toHaveLength(2);
        }
      });

      it("should fail when title is missing", () => {
        const invalidData = {
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it("should fail when content is missing", () => {
        const invalidData = {
          title: "Valid Title"
        };

        const result = noteFormSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it("should handle special characters in title", () => {
        const validData = {
          title: "Title with special chars: @#$%^&*()",
          content: "Valid content"
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it("should handle newlines in content", () => {
        const validData = {
          title: "Valid Title",
          content: "Line 1\nLine 2\nLine 3"
        };

        const result = noteFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("noteSchema", () => {
    it("should pass with valid note including id", () => {
      const validData = {
        id: 1,
        title: "Valid Title",
        content: "Valid content"
      };

      const result = noteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should pass with valid note without id", () => {
      const validData = {
        title: "Valid Title",
        content: "Valid content"
      };

      const result = noteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("createNoteSchema", () => {
    it("should pass with valid create data", () => {
      const validData = {
        title: "New Note",
        content: "New content"
      };

      const result = createNoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should not include id field", () => {
      const dataWithId = {
        id: 1,
        title: "New Note",
        content: "New content"
      };

      const result = createNoteSchema.safeParse(dataWithId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty("id");
      }
    });
  });

  describe("updateNoteSchema", () => {
    it("should pass with partial update data", () => {
      const validData = {
        title: "Updated Title"
      };

      const result = updateNoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should pass with only content update", () => {
      const validData = {
        content: "Updated content"
      };

      const result = updateNoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should pass with both fields updated", () => {
      const validData = {
        title: "Updated Title",
        content: "Updated content"
      };

      const result = updateNoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should pass with empty object for partial update", () => {
      const validData = {};

      const result = updateNoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should not include id field", () => {
      const dataWithId = {
        id: 1,
        title: "Updated Title"
      };

      const result = updateNoteSchema.safeParse(dataWithId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty("id");
      }
    });

    it("should fail when title is provided but empty", () => {
      const invalidData = {
        title: ""
      };

      const result = updateNoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should fail when content is provided but empty", () => {
      const invalidData = {
        content: ""
      };

      const result = updateNoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("VALIDATION_RULES constants", () => {
    it("should have correct title minimum length", () => {
      expect(VALIDATION_RULES.TITLE_MIN_LENGTH).toBe(1);
    });

    it("should have correct title maximum length", () => {
      expect(VALIDATION_RULES.TITLE_MAX_LENGTH).toBe(255);
    });

    it("should have correct content minimum length", () => {
      expect(VALIDATION_RULES.CONTENT_MIN_LENGTH).toBe(1);
    });
  });

  describe("VALIDATION_MESSAGES constants", () => {
    it("should have correct title required message", () => {
      expect(VALIDATION_MESSAGES.TITLE_REQUIRED).toBe("Title is required");
    });

    it("should have correct title too long message", () => {
      expect(VALIDATION_MESSAGES.TITLE_TOO_LONG).toBe("Title is too long");
    });

    it("should have correct content required message", () => {
      expect(VALIDATION_MESSAGES.CONTENT_REQUIRED).toBe("Content is required");
    });
  });
});
