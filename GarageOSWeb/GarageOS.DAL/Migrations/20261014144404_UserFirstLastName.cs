using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <summary>
    /// Splits <c>users.name</c> and drops <c>photo_url</c> (ADR-0010).
    /// Hand-edited: the scaffold dropped and re-added the column, emptying
    /// every existing name. A rename keeps it.
    /// </summary>
    public partial class UserFirstLastName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "name",
                table: "users",
                newName: "first_name");

            migrationBuilder.AlterColumn<string>(
                name: "first_name",
                table: "users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200);

            migrationBuilder.AddColumn<string>(
                name: "last_name",
                table: "users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            // Never populated: nothing ever wrote it, and the decision is not to
            // (ADR-0010).
            migrationBuilder.DropColumn(
                name: "photo_url",
                table: "users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "photo_url",
                table: "users",
                type: "character varying(512)",
                maxLength: 512,
                nullable: true);

            // Whatever was in `last_name` is lost here. Rejoining it onto
            // `first_name` would invent a full name in a format nothing asked
            // for, and this direction only runs when the split is being undone.
            migrationBuilder.DropColumn(
                name: "last_name",
                table: "users");

            migrationBuilder.AlterColumn<string>(
                name: "first_name",
                table: "users",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128);

            migrationBuilder.RenameColumn(
                name: "first_name",
                table: "users",
                newName: "name");
        }
    }
}
