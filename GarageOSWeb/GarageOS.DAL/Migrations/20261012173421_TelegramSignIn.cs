using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <inheritdoc />
    public partial class TelegramSignIn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Таблиця users порожня за побудовою: ендпойнта реєстрації не було
            // ніколи, профілі мав створювати Firebase, якого в коді так і не
            // з'явилося. Тому ні переносу даних, ні запасних значень для
            // telegram_id і phone тут немає — на непорожній таблиці ця міграція
            // впала б на unique-індексах, і це правильніше за тихе склеювання
            // рядків під значення 0 та ''.
            migrationBuilder.DropIndex(
                name: "ix_users_firebase_uid",
                table: "users");

            migrationBuilder.DropColumn(
                name: "email",
                table: "users");

            migrationBuilder.DropColumn(
                name: "firebase_uid",
                table: "users");

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "users",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "photo_url",
                table: "users",
                type: "character varying(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "refresh_expires_at",
                table: "users",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "refresh_token_hash",
                table: "users",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "telegram_id",
                table: "users",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "login_codes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    code_hash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    consumed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    attempts = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_login_codes", x => x.id);
                    table.ForeignKey(
                        name: "fk_login_codes_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            // defaultValue вище потрібен лише на час ALTER/ADD, щоб наявні рядки
            // мали чим заповнитися. Як стовпцевий DEFAULT він лишився б назавжди
            // і став би пасткою: INSERT повз сутність вставив би порожній номер і
            // нульовий telegram_id, а перший такий рядок зайняв би unique-індекс.
            migrationBuilder.Sql("ALTER TABLE users ALTER COLUMN phone DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE users ALTER COLUMN telegram_id DROP DEFAULT;");

            migrationBuilder.CreateIndex(
                name: "ix_users_phone",
                table: "users",
                column: "phone",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_refresh_token_hash",
                table: "users",
                column: "refresh_token_hash");

            migrationBuilder.CreateIndex(
                name: "ix_users_telegram_id",
                table: "users",
                column: "telegram_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_login_codes_expires_at",
                table: "login_codes",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "ix_login_codes_user_id_active",
                table: "login_codes",
                column: "user_id",
                unique: true,
                filter: "consumed_at IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "login_codes");

            migrationBuilder.DropIndex(
                name: "ix_users_phone",
                table: "users");

            migrationBuilder.DropIndex(
                name: "ix_users_refresh_token_hash",
                table: "users");

            migrationBuilder.DropIndex(
                name: "ix_users_telegram_id",
                table: "users");

            migrationBuilder.DropColumn(
                name: "photo_url",
                table: "users");

            migrationBuilder.DropColumn(
                name: "refresh_expires_at",
                table: "users");

            migrationBuilder.DropColumn(
                name: "refresh_token_hash",
                table: "users");

            migrationBuilder.DropColumn(
                name: "telegram_id",
                table: "users");

            migrationBuilder.AlterColumn<string>(
                name: "phone",
                table: "users",
                type: "character varying(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10);

            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "users",
                type: "character varying(320)",
                maxLength: 320,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "firebase_uid",
                table: "users",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "ix_users_firebase_uid",
                table: "users",
                column: "firebase_uid",
                unique: true);
        }
    }
}
