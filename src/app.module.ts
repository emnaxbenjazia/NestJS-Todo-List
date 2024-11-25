import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo/todo.entity';
import { TodoService } from './todo/todo.service';
//import { TestController } from './todo/testController';
import { TodoController } from './todo/todo.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // You are using MySQL
      host: 'localhost',
      port: 3306, 
      username: 'root',
      password: '',
      database: 'todolist',
      entities: [TodoEntity], // Register your entity
      synchronize: true, // Automatically sync database schema
      logging: ["error"],
      logger: "advanced-console"
    }),
    TypeOrmModule.forFeature([TodoEntity]), // Register TodoEntity for repository access
  ],
  controllers: [TodoController], // Register the controller
  providers: [TodoService], // Register the service
})
export class AppModule {}
