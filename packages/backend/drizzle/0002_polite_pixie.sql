CREATE TABLE "expense" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount" numeric NOT NULL,
	"receipt_path" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" serial PRIMARY KEY NOT NULL,
	"filename" text NOT NULL,
	"vote" text DEFAULT 'not voted' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
