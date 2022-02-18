-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductBid" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bid" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductBid_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductBid_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductBid" ("bid", "createdAt", "id", "productId", "userId") SELECT "bid", "createdAt", "id", "productId", "userId" FROM "ProductBid";
DROP TABLE "ProductBid";
ALTER TABLE "new_ProductBid" RENAME TO "ProductBid";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
