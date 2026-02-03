import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/**
 * API Info Response interface
 */
export interface ApiInfoResponse {
  name: string;
  version: string;
  description: string;
  status: string;
  timestamp: string;
  author: string;
  documentation: string;
}

/**
 * Root Controller - Health Check
 * Provides API root endpoint and health check functionality
 */
@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Root endpoint - API information
   * Returns API name, version, and basic information
   */
  @Get()
  @ApiOperation({ 
    summary: 'API Root - Health Check',
    description: 'Root endpoint that returns API information and health status. Use this to verify the API is running.'
  })
  @ApiResponse({ status: 200, description: 'API is running. Returns API name, version, and timestamp.' })
  getApiInfo(): ApiInfoResponse {
    return {
      name: 'Internal Leave Request API',
      version: '1.0.0',
      description: 'API for managing internal leave requests with role-based access control',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      author: 'API Team',
      documentation: '/api',
    };
  }
}
