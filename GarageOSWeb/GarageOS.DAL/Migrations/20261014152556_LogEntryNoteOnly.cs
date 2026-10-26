using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <summary>
    /// One description per log entry, no odometer; car year and mileage become
    /// optional (ADR-0012). Hand-edited: the scaffold dropped <c>title</c> and
    /// blanked the empty notes, so the title is merged in first.
    /// </summary>
    public partial class LogEntryNoteOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                UPDATE log_entries
                SET note = LEFT(
                    CASE
                        WHEN note IS NULL OR note = '' THEN title
                        ELSE title || ' — ' || note
                    END, 1000);
                """);

            migrationBuilder.AlterColumn<string>(
                name: "note",
                table: "log_entries",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "title",
                table: "log_entries");

            migrationBuilder.DropColumn(
                name: "mileage",
                table: "log_entries");

            // Widening to nullable keeps every existing value.
            migrationBuilder.AlterColumn<int>(
                name: "year",
                table: "cars",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<int>(
                name: "mileage",
                table: "cars",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Narrowing back needs a value for rows stored without one.
            migrationBuilder.Sql("UPDATE cars SET year = 0 WHERE year IS NULL;");
            migrationBuilder.Sql("UPDATE cars SET mileage = 0 WHERE mileage IS NULL;");

            migrationBuilder.AlterColumn<int>(
                name: "mileage",
                table: "cars",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "year",
                table: "cars",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "mileage",
                table: "log_entries",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            // The merged note is not split back: no rule says which words were the title.
            migrationBuilder.AddColumn<string>(
                name: "title",
                table: "log_entries",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "note",
                table: "log_entries",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);
        }
    }
}
