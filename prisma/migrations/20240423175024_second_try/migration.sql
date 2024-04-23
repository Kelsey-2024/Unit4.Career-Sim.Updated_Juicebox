-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userid_fkey";

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
