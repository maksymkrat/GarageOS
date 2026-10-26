using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <summary>
    /// An entry's date is <c>CreatedAt</c> now (ADR-0013). Hand-edited: the
    /// scaffold dropped the column, collapsing every entry onto its insert day,
    /// so the date is carried over first. Midday, not midnight, survives the
    /// local-time shift on read.
    /// </summary>
    public partial class LogEntryDateFromCreatedAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE log_entries SET created_at = date + interval '12 hours';");

            migrationBuilder.DropColumn(
                name: "date",
                table: "log_entries");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "date",
                table: "log_entries",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.Sql("UPDATE log_entries SET date = created_at::date;");
        }
    }
}
