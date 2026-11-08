import { InternalServerError } from "@/shared/error/error.js";
import { DashboardRepository } from "./dashboard.repository.js";
import { DASHBOARD_ERRORS } from "./dashboard.constants.js";
import {
  DashboardStatsOutput,
  PaymentsTrendOutput,
} from "./dashboard.types.js";

export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}

  async getStats(): Promise<DashboardStatsOutput> {
    try {
      return await this.dashboardRepository.getStats();
    } catch {
      throw new InternalServerError(DASHBOARD_ERRORS.STATS_FAILED);
    }
  }

  async getPaymentsTrend(): Promise<PaymentsTrendOutput> {
    try {
      return await this.dashboardRepository.getPaymentsTrend();
    } catch {
      throw new InternalServerError(DASHBOARD_ERRORS.TREND_FAILED);
    }
  }
}

export const dashboardService = new DashboardService(
  new DashboardRepository(),
);