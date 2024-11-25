import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';
import { StatusEnum } from './status.enum';
import { Not, IsNull } from 'typeorm';

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name);
  private readonly newTodoRepository: Repository<TodoEntity>;

  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  // Create a new to-do item
  async createTodo(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
    const newTodo = this.todoRepository.create({
      ...createTodoDto,
      status: createTodoDto.status || StatusEnum.PENDING, // Set default status
    });
    return await this.todoRepository.save(newTodo);
  }

  // Get all to-do items
  /*
  async getAllTodos(): Promise<TodoEntity[]> {
    return await this.todoRepository.find();
  } */


async getTodos(
  page?: number,
  limit?: number,
  search?: string,
  status?: StatusEnum,
): Promise<any> {
  const queryBuilder = this.todoRepository.createQueryBuilder('todos');

  // Apply pagination if both page and limit are provided
  if (page && limit) {
    queryBuilder.skip((page - 1) * limit).take(limit);
  }

  // Apply search filter if provided
  if (search) {
    queryBuilder.where(
      '(todos.name LIKE :search OR todos.description LIKE :search)',
      { search: `%${search}%` }
    );
  }

  // Apply status filter if provided
  if (status) {
    if (search) {
      queryBuilder.andWhere('todos.status = :status', { status });
    } else {
      queryBuilder.where('todos.status = :status', { status });
    }
  }

  // Get the total count of items after applying filters
  const totalItems = await queryBuilder.getCount();

  // Get the filtered items
  const items = await queryBuilder.getMany();

  return {
    data: items,
    totalItems,
    totalPages: limit ? Math.ceil(totalItems / limit) : 1,
  };
}



  // Get a single to-do item by ID
  async getTodoById(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found.`);
    }
    return todo;
  }

  // Update a to-do item
  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.getTodoById(id); // Ensure the todo exists
    const updatedTodo = Object.assign(todo, updateTodoDto); // Merge existing todo with updates
    return await this.todoRepository.save(updatedTodo); // Save the updated todo
  }

  // Update a to-do's status
  async updateStatus(id: number, status: StatusEnum): Promise<TodoEntity> {
    const todo = await this.getTodoById(id); // Ensure the todo exists
    todo.status = status; // Update status
    return await this.todoRepository.save(todo); // Save the updated todo
  }

// Delete a to-do item by ID
async deleteTodo(id: number): Promise<void> {
    const result = await this.todoRepository.softDelete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
  }

  async restoreTodo(id: number): Promise<TodoEntity> {
    const result = await this.todoRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo with ID ${id} not found or already restored.`);
    }
    return this.getTodoById(id);
  }
  
   // Method to get the count of Todos for each status
   async getTodoCountsByStatus(): Promise<{ status: StatusEnum; count: string }[]> {
    console.log("inside the service logic ");
    this.logger.debug('Entering getTodoCountsByStatus method');
    
    try {
      const queryBuilder = this.todoRepository.createQueryBuilder('todos');
      
      const query = queryBuilder
        .select('todos.status', 'status')
        .addSelect('COUNT(todos.id)', 'count')
        .where('todos.DeletedAt IS NULL')
        .groupBy('todos.status');

      this.logger.debug(`Generated SQL: ${query.getQuery()}`);
      
      const counts = await query.getRawMany();
      
      this.logger.debug(`Counts result: ${JSON.stringify(counts)}`);
      
      return counts;
    } catch (error) {
      this.logger.error(`Error in getTodoCountsByStatus: ${error.message}`, error.stack);
      throw error;
    }
   }

   async restoreAllDeletedTodos(): Promise<void> {
    // Restore all deleted todos
    await this.todoRepository.createQueryBuilder()
      .restore()
      .execute();
  }

// we're creating async function because database operations often take a while and we dont want 
//the app to freeze while thats happening.
  //When you mark a function as async, it automatically returns a promise.
  //A promise is like a placeholder for a future value. It tells the program:
//"I don't have the result right now, but I promise to give it to you later once the database operation is done."
  // await means pause the execution of the function until the promise is resolved

}