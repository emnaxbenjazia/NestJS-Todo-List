import { Controller, Get, Post, Delete, Param, Body, Patch, ValidationPipe, UsePipes, ParseIntPipe, Logger, NotFoundException, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { StatusEnum } from './status.enum';
import { CreateTodoDto, UpdateTodoDto } from './todo.dto';

@Controller('todos')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class TodoController {
    
  private readonly logger = new Logger(TodoController.name);
  constructor(private readonly todoService: TodoService) {}


@Get('countbystatus')
async getTodoCountsByStatus() {
    console.log('im inside the route in the controller');
  this.logger.debug('Entering getTodoCountsByStatus controller method');
  try {
    const counts = await this.todoService.getTodoCountsByStatus();
    this.logger.debug(`Counts received: ${JSON.stringify(counts)}`);
    return counts;
  } catch (error) {
    this.logger.error(`Error in getTodoCountsByStatus controller: ${error.message}`, error.stack);
    throw error;
  }
}


  // Get all to-do items
  /*
  @Get()
  getAllTodos() {
    return this.todoService.getAllTodos();
  } */

  @Get()
  async getTodos(
    @Query('page') page: number = 1,         // Optional, defaults to 1
    @Query('limit') limit: number = 10,      // Optional, defaults to 10
    @Query('search') search?: string,         // Optional search string
    @Query('status') status?: StatusEnum      // Optional status filter
  ) {
    return await this.todoService.getTodos(page, limit, search, status);
    }


  // Get a single to-do item by ID
  @Get(':id')
  getTodoById(@Param('id', ParseIntPipe) id: number) {
    console.log(`attempting to get item with id: ${id}` )
    const todo = this.todoService.getTodoById(+id);
    if (!todo) {
        throw new NotFoundException(`Todo with ID ${id} not found.`);
      }
    return todo;
  }

  // Create a new to-do item
  @Post()
  createTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.createTodo(createTodoDto);
  }

  @Patch('restore-all')
  async restoreAllDeletedTodos() {
    console.log('attemting to restore all')
    return this.todoService.restoreAllDeletedTodos();
}

  // Update a to-do item
  @Patch(':id')
  updateTodo(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.updateTodo(+id, updateTodoDto);
  }

  // Update a to-do's status
  @Patch(':id/status')
  updateTodoStatus(@Param('id', ParseIntPipe) id: number, @Body('status') status: StatusEnum) {
    return this.todoService.updateStatus(+id, status);
  }


  // Delete a to-do item
@Delete(':id')
async deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<void> {
    console.log(`Attempting to delete todo with ID: ${id}`);
    return this.todoService.deleteTodo(+id);
}

@Patch(':id/restore')
  restoreTodo(@Param('id', ParseIntPipe) id: number) {
    console.log(`Attempting to restore todo with ID: ${id}`);
    return this.todoService.restoreTodo(+id);
  }

}


