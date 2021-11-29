import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostController } from "./controller/post.controller";
import { PostService } from "./service/post.service";
import { PostRepository } from "./post.repository";
import { UserRepository } from "src/user/user.repository";
import { AlbumRepository } from "src/album/album.repository";
import { ImageModule } from "src/image/image.module";
import { AlbumModule } from "src/album/album.module";
import { HashtagModule } from "src/hashtag/hashtag.module";
import { HashTagRepository } from "src/hashtag/hashtag.repository";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    ImageModule,
    AlbumModule,
    HashtagModule,
    AuthModule,
    TypeOrmModule.forFeature([PostRepository, UserRepository, AlbumRepository, HashTagRepository]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
