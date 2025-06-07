ALTER TABLE "expense" ADD COLUMN "employee_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "report" ADD COLUMN "expense_id" integer;--> statement-breakpoint
ALTER TABLE "expense" ADD CONSTRAINT "expense_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_expense_id_expense_id_fk" FOREIGN KEY ("expense_id") REFERENCES "public"."expense"("id") ON DELETE cascade ON UPDATE no action;