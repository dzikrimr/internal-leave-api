import { Test, TestingModule } from '@nestjs/testing';
import { AppController, ApiInfoResponse } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getApiInfo', () => {
    it('should return API info', () => {
      const result: ApiInfoResponse = appController.getApiInfo();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('status');
      expect(result.name).toBe('Internal Leave Request API');
      expect(result.version).toBe('1.0.0');
      expect(result.status).toBe('healthy');
    });
  });
});
