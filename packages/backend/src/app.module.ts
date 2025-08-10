import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { RoomModule } from './room/room.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'database.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            // synchronize: true,
            logger: 'advanced-console',
        }),
        // TypeOrmModule.forRootAsync({
        //     useFactory: (args: ConfigService) => {
        //         console.log('args', process.env.DB_TYPE);
        //
        //         return {
        //             type: 'sqlite',
        //             database: 'database.sqlite',
        //             entities: [__dirname + '/**/*.entity{.ts,.js}'],
        //             synchronize: true,
        //             logger: 'advanced-console',
        //         };
        //     },
        //     dataSourceFactory: async options => {
        //         console.log('options', options);
        //         const dataSource = await new DataSource(options).initialize();
        //         return dataSource;
        //     },
        // }),
        AuthModule,
        UserModule,
        ChatModule,
        RoomModule,
    ],
})
export class AppModule {}
