import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      })

        .compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
  });
  afterAll(async () => {
    await app.close();
  });
  it.todo('should passs');
  describe('Auth', () => {
    describe('Signup', () => {
      it('Should sign up', () => {
        const dto: AuthDto = {
          email: 'irakliorjo@gmail.com',
          password: '123',
        };
        return pactum
          .spec()
          .post(
            'http://localhost:3333/auth/signup',
          )
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it.todo('Should sign in');
    });
  });
  describe('User', () => {
    describe('get me', () => {});
    describe('Edit user', () => {});
  });
  describe('Bookmarks', () => {
    describe('Create Bookmar', () => {});
    describe('get Bookmar', () => {});
    describe('get Bookmar by id ', () => {});
    describe('edit Bookmar', () => {});
    describe('delete Bookmar by id ', () => {});
  });
});
