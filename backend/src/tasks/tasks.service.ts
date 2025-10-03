import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepo: Repository<Task>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async create(userId: number, dto: CreateTaskDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new ForbiddenException('Invalid user');
    const task = this.tasksRepo.create({ ...dto, user });
    const saved = await this.tasksRepo.save(task);
    return this.tasksRepo.findOne({
      where: { id: saved.id },
      relations: { user: true },
    });
  }

  findAll(userId: number) {
    return this.tasksRepo.find({ where: { user: { id: userId } } });
  }

  async findOne(userId: number, id: number) {
    const task = await this.tasksRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(userId: number, id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(userId, id);
    Object.assign(task, dto);
    return this.tasksRepo.save(task);
  }

  async remove(userId: number, id: number) {
    const task = await this.findOne(userId, id);
    await this.tasksRepo.remove(task);
    return { success: true };
  }
}
