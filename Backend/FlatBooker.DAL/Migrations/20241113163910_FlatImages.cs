using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlatBooker.DAL.Migrations
{
    /// <inheritdoc />
    public partial class FlatImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FlatImages",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    FlatId = table.Column<string>(type: "text", nullable: false),
                    ImageBase64 = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlatImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FlatImages_Flats_FlatId",
                        column: x => x.FlatId,
                        principalTable: "Flats",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FlatImages_FlatId",
                table: "FlatImages",
                column: "FlatId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FlatImages");
        }
    }
}
