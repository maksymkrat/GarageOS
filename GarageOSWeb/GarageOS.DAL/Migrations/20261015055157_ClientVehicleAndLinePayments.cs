using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace GarageOS.DAL.Migrations
{
    /// <summary>
    /// Renames <c>cars</c> to <c>client_vehicles</c> (ADR-0014), gives mileage a
    /// unit (ADR-0015), moves payment onto order lines (ADR-0016) and strips the
    /// order of its own status, date and waiting counter (ADR-0017).
    /// Hand-edited throughout: the scaffold dropped and re-created <c>cars</c>,
    /// and reused the <c>days_waiting</c> column as
    /// <c>orders.client_vehicle_id</c> — every order would have pointed at a
    /// vehicle id equal to its old day count. Renames keep the rows, and the
    /// value translations below keep the data meaningful.
    /// </summary>
    public partial class ClientVehicleAndLinePayments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "cars",
                newName: "client_vehicles");

            migrationBuilder.Sql(
                "ALTER TABLE client_vehicles RENAME CONSTRAINT pk_cars TO pk_client_vehicles;");

            migrationBuilder.Sql(
                "ALTER TABLE client_vehicles RENAME CONSTRAINT fk_cars_clients_client_id "
                + "TO fk_client_vehicles_clients_client_id;");

            migrationBuilder.RenameIndex(
                name: "ix_cars_client_id",
                table: "client_vehicles",
                newName: "ix_client_vehicles_client_id");

            migrationBuilder.RenameIndex(
                name: "ix_cars_plate",
                table: "client_vehicles",
                newName: "ix_client_vehicles_plate");

            migrationBuilder.AddColumn<string>(
                name: "mileage_unit",
                table: "client_vehicles",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "Kilometers");

            migrationBuilder.Sql(
                "ALTER TABLE client_vehicles ALTER COLUMN mileage_unit DROP DEFAULT;");

            migrationBuilder.Sql(
                "ALTER TABLE orders RENAME CONSTRAINT fk_orders_cars_car_id "
                + "TO fk_orders_client_vehicles_client_vehicle_id;");

            migrationBuilder.RenameColumn(
                name: "car_id",
                table: "orders",
                newName: "client_vehicle_id");

            migrationBuilder.RenameIndex(
                name: "ix_orders_car_id",
                table: "orders",
                newName: "ix_orders_client_vehicle_id");

            migrationBuilder.Sql(
                "ALTER TABLE reminders RENAME CONSTRAINT fk_reminders_cars_car_id "
                + "TO fk_reminders_client_vehicles_client_vehicle_id;");

            migrationBuilder.RenameColumn(
                name: "car_id",
                table: "reminders",
                newName: "client_vehicle_id");

            migrationBuilder.RenameIndex(
                name: "ix_reminders_car_id",
                table: "reminders",
                newName: "ix_reminders_client_vehicle_id");

            migrationBuilder.CreateIndex(
                name: "ix_orders_created_at",
                table: "orders",
                column: "created_at");

            migrationBuilder.DropColumn(
                name: "date",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "status",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "paid",
                table: "orders");

            migrationBuilder.DropColumn(
                name: "days_waiting",
                table: "orders");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "order_works",
                newName: "description");

            migrationBuilder.AddColumn<string>(
                name: "payment_status",
                table: "order_works",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "Unpaid");

            migrationBuilder.Sql(
                "ALTER TABLE order_works ALTER COLUMN payment_status DROP DEFAULT;");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "order_parts",
                newName: "description");

            migrationBuilder.AddColumn<string>(
                name: "payment_status",
                table: "order_parts",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "Unpaid");

            migrationBuilder.Sql(
                "ALTER TABLE order_parts ALTER COLUMN payment_status DROP DEFAULT;");

            // A part line is now a total, not a unit price. Folding the quantity
            // into both prices before the column goes keeps every debt and every
            // margin the number it was. Lines with qty 0 or 1 keep their prices.
            migrationBuilder.Sql(
                "UPDATE order_parts SET buy = buy * qty, sell = sell * qty WHERE qty > 1;");

            migrationBuilder.DropColumn(
                name: "qty",
                table: "order_parts");

            migrationBuilder.RenameColumn(
                name: "unit",
                table: "my_vehicles",
                newName: "mileage_unit");

            migrationBuilder.AlterColumn<string>(
                name: "mileage_unit",
                table: "my_vehicles",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(20)",
                oldMaxLength: 20);

            // The column held the Ukrainian label the screen printed; it now
            // holds the enum name. Anything that is not engine hours is
            // kilometres.
            migrationBuilder.Sql(
                "UPDATE my_vehicles SET mileage_unit = CASE WHEN mileage_unit IN "
                + "('мотогод', 'мотогодини', 'hours') THEN 'Hours' ELSE 'Kilometers' END;");

            migrationBuilder.DropColumn(
                name: "due",
                table: "my_vehicles");

            migrationBuilder.AddColumn<int>(
                name: "mileage",
                table: "log_entries",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "mileage_unit",
                table: "log_entries",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "Kilometers");

            migrationBuilder.Sql(
                "ALTER TABLE log_entries ALTER COLUMN mileage_unit DROP DEFAULT;");

            // An existing entry was written in whatever unit its vehicle counts
            // in.
            migrationBuilder.Sql(
                "UPDATE log_entries SET mileage_unit = v.mileage_unit FROM my_vehicles v "
                + "WHERE log_entries.vehicle_id = v.id;");

            migrationBuilder.DropTable(
                name: "payments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Nothing ever wrote a payment row, so the table comes back empty.
            migrationBuilder.CreateTable(
                name: "payments",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    order_id = table.Column<int>(type: "integer", nullable: false),
                    date = table.Column<DateOnly>(type: "date", nullable: false),
                    amount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    method = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_payments", x => x.id);
                    table.ForeignKey(
                        name: "fk_payments_orders_order_id",
                        column: x => x.order_id,
                        principalTable: "orders",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_payments_order_id",
                table: "payments",
                column: "order_id");

            migrationBuilder.DropColumn(
                name: "mileage",
                table: "log_entries");

            migrationBuilder.DropColumn(
                name: "mileage_unit",
                table: "log_entries");

            migrationBuilder.AddColumn<string>(
                name: "due",
                table: "my_vehicles",
                type: "character varying(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.Sql(
                "UPDATE my_vehicles SET mileage_unit = CASE WHEN mileage_unit = 'Hours' "
                + "THEN 'мотогод' ELSE 'км' END;");

            migrationBuilder.AlterColumn<string>(
                name: "mileage_unit",
                table: "my_vehicles",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            migrationBuilder.RenameColumn(
                name: "mileage_unit",
                table: "my_vehicles",
                newName: "unit");

            // The unit price behind a folded line is gone, so every line comes
            // back as a single item at what is now its total.
            migrationBuilder.AddColumn<int>(
                name: "qty",
                table: "order_parts",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.Sql("ALTER TABLE order_parts ALTER COLUMN qty DROP DEFAULT;");

            migrationBuilder.DropColumn(
                name: "payment_status",
                table: "order_parts");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "order_parts",
                newName: "name");

            migrationBuilder.DropColumn(
                name: "payment_status",
                table: "order_works");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "order_works",
                newName: "name");

            migrationBuilder.DropIndex(
                name: "ix_orders_created_at",
                table: "orders");

            migrationBuilder.AddColumn<DateOnly>(
                name: "date",
                table: "orders",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "orders",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "InWork");

            migrationBuilder.AddColumn<decimal>(
                name: "paid",
                table: "orders",
                type: "numeric(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "days_waiting",
                table: "orders",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql("ALTER TABLE orders ALTER COLUMN date DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE orders ALTER COLUMN paid DROP DEFAULT;");
            migrationBuilder.Sql("ALTER TABLE orders ALTER COLUMN days_waiting DROP DEFAULT;");

            // What the order lost was derivable or manual: the date comes back
            // from created_at, the status from its vehicle, paid from the lines
            // marked paid. days_waiting stays 0 — it was a stale counter, and
            // what day it is today is not a migration's business.
            migrationBuilder.Sql(
                "UPDATE orders SET date = (created_at AT TIME ZONE 'UTC')::date;");

            migrationBuilder.Sql(
                "UPDATE orders o SET status = v.status FROM client_vehicles v "
                + "WHERE o.client_vehicle_id = v.id;");

            migrationBuilder.Sql(
                "UPDATE orders o SET paid = COALESCE((SELECT SUM(w.price) FROM order_works w "
                + "WHERE w.order_id = o.id AND w.payment_status = 'Paid'), 0) + "
                + "COALESCE((SELECT SUM(p.sell) FROM order_parts p "
                + "WHERE p.order_id = o.id AND p.payment_status = 'Paid'), 0);");

            migrationBuilder.RenameIndex(
                name: "ix_reminders_client_vehicle_id",
                table: "reminders",
                newName: "ix_reminders_car_id");

            migrationBuilder.RenameColumn(
                name: "client_vehicle_id",
                table: "reminders",
                newName: "car_id");

            migrationBuilder.Sql(
                "ALTER TABLE reminders RENAME CONSTRAINT "
                + "fk_reminders_client_vehicles_client_vehicle_id TO fk_reminders_cars_car_id;");

            migrationBuilder.RenameIndex(
                name: "ix_orders_client_vehicle_id",
                table: "orders",
                newName: "ix_orders_car_id");

            migrationBuilder.RenameColumn(
                name: "client_vehicle_id",
                table: "orders",
                newName: "car_id");

            migrationBuilder.Sql(
                "ALTER TABLE orders RENAME CONSTRAINT "
                + "fk_orders_client_vehicles_client_vehicle_id TO fk_orders_cars_car_id;");

            migrationBuilder.DropColumn(
                name: "mileage_unit",
                table: "client_vehicles");

            migrationBuilder.RenameIndex(
                name: "ix_client_vehicles_plate",
                table: "client_vehicles",
                newName: "ix_cars_plate");

            migrationBuilder.RenameIndex(
                name: "ix_client_vehicles_client_id",
                table: "client_vehicles",
                newName: "ix_cars_client_id");

            migrationBuilder.Sql(
                "ALTER TABLE client_vehicles RENAME CONSTRAINT "
                + "fk_client_vehicles_clients_client_id TO fk_cars_clients_client_id;");

            migrationBuilder.Sql(
                "ALTER TABLE client_vehicles RENAME CONSTRAINT pk_client_vehicles TO pk_cars;");

            migrationBuilder.RenameTable(
                name: "client_vehicles",
                newName: "cars");
        }
    }
}
