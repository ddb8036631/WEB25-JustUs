import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AlbumRepository } from "../album.repository";
import { GroupRepository } from "src/group/group.repository";
import { CreateAlbumRequestDto } from "src/dto/album/createAlbumRequest.dto";
import { UpdateAlbumInfoRequestDto } from "src/dto/album/updateAlbumInfoRequest.dto";
import { CreateAlbumResponseDto } from "src/dto/album/createAlbumResponse.dto";
import { Album } from "../album.entity";
import { PostRepository } from "src/post/post.repository";

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumRepository)
    private albumRepository: AlbumRepository,
    @InjectRepository(GroupRepository)
    private groupRepository: GroupRepository,
    @InjectRepository(PostRepository)
    private postRepository: PostRepository,
  ) {}

  async createAlbum(createAlbumRequestDto: CreateAlbumRequestDto): Promise<CreateAlbumResponseDto> {
    const { groupId, albumName } = createAlbumRequestDto;
    const group = await this.groupRepository.findOne({ groupId });
    if (!group) throw new NotFoundException(`Not found group with the id ${groupId}`);

    const album = await this.albumRepository.save({
      albumName: albumName,
      base: false,
      group: group,
    });
    const { albumId } = album;

    const { albumOrder } = group;
    const newAlbumOrder = `${albumOrder},${albumId}`;
    await this.groupRepository.update(groupId, { albumOrder: newAlbumOrder });

    return { albumId };
  }

  async updateAlbumInfo(albumId: number, updateAlbumInfoRequestDto: UpdateAlbumInfoRequestDto): Promise<string> {
    const { albumName } = updateAlbumInfoRequestDto;
    const album = await this.albumRepository.findOne({ albumId });
    if (!album) throw new NotFoundException(`Not found album with the id ${albumId}`);

    this.albumRepository.update(albumId, { albumName });

    return "AlbumInfo update success!!";
  }

  async deleteAlbum(albumId: number): Promise<string> {
    const album = await this.albumRepository.findOne({ albumId });
    if (!album) throw new NotFoundException(`Not found album with the id ${albumId}`);

    const { base, group } = album;
    if (base) throw new NotFoundException("It cannot be deleted because it is baseAlbum.");

    const { groupId } = group;
    const baseAlbum = await this.getBaseAlbumId(groupId);
    await this.movePosts(albumId, baseAlbum);

    this.albumRepository.softRemove(album);

    return "Album delete success!!";
  }

  async getBaseAlbumId(groupId: number): Promise<Album> {
    const { albums } = await this.groupRepository.getBaseAlbumQuery(groupId);
    if (!albums) throw new NotFoundException(`Not found group with the id ${groupId}`);
    const baseAlbumId = albums[0];

    return baseAlbumId;
  }

  async movePosts(albumId: number, baseAlbum: Album): Promise<void> {
    const { posts } = await this.getMovePosts(albumId);

    posts.forEach(post => {
      const postId = post.postId;
      this.postRepository.update(postId, { album: baseAlbum });
    });
  }

  async getMovePosts(albumId: number): Promise<Album> {
    const album = await this.albumRepository.getDeletePostIdQuery(albumId);
    if (!album) throw new NotFoundException(`Not found album with the id ${albumId}`);

    return album;
  }

  ArrayToObject(albums: Album[]): object {
    const result = albums.reduce((target, key) => {
      target[key.albumId] = key;
      return target;
    }, {});

    return result;
  }
}
