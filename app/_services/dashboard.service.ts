import axiosWrapper from "./axiosWrapper";
import {
  AverageResolution,
  AverageResolutionByUser,
  AverageResolutionByUserAssigned,
  BusinessIntelligenceEpp,
  CriticalZone,
  GlobalSummary,
  MainTypesGlobalTrend,
  MainTypesGlobalTrendDetails,
  MainTypesGlobalTrendDetailsZone,
  MonthlyGlobalTrend,
  MonthlySubtypeTrend,
  MonthlyTypeTrend,
  MyEvidences,
  OpenEvidence,
  PendingBySeniorityByUser,
  RankingOfResponsible,
  RecentEvidence,
  ResponseAccidents,
  ResponseDashboardEvidencesByMonth,
  ResponseDashboardMainTypes,
  ResponseDashboardMultiNivel,
  ResponseOpenVsClosed,
  ResponseTopUsersByPlant,
  TypeEvidenceByUser,
} from "@interfaces";

const api = axiosWrapper({
  baseURL: "/dashboard",
});

const findAllStatus = async () => {
  const { data } = await api.get<ResponseDashboardMultiNivel>("/status");
  return data;
};

const findOpendVsClosed = async () => {
  const { data } = await api.get<ResponseOpenVsClosed>("/open-vs-closed");
  return data;
};

const findAccidentRate = async (year?: number) => {
  const { data } = await api.get<ResponseAccidents[]>("/accidents-by-month", {
    params: {
      ...(year && { year }),
    },
  });
  return data;
};

const findAllZones = async () => {
  const { data } = await api.get<ResponseDashboardMultiNivel>("/zones");
  return data;
};

const findAllMainTypes = async () => {
  const { data } = await api.get<ResponseDashboardMainTypes>("/main-types");
  return data;
};

const findAllEvidencesByMonth = async (year?: number) => {
  const { data } = await api.get<ResponseDashboardEvidencesByMonth>(
    "/evidences-by-month",
    {
      params: {
        ...(year && { year }),
      },
    },
  );
  return data;
};

const findTopUsersByPlant = async () => {
  const { data } = await api.get<ResponseTopUsersByPlant>(
    "/top-users-by-plant",
  );
  return data.data;
};

const findMyEvidences = async (userId: number) => {
  const { data } = await api.get<MyEvidences>(`/my-evidences/${userId}`);
  return data;
};

const findCriticalZones = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<CriticalZone[]>("/critical-zones", {
    params: {
      manufacturingPlantId,
    },
  });
  return data;
};

const findGlobalSummary = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<GlobalSummary>("/global-summary", {
    params: {
      manufacturingPlantId,
    },
  });
  return data;
};

const findRankingOfResponsibles = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<RankingOfResponsible[]>(
    "/ranking-of-responsibles",
    {
      params: {
        manufacturingPlantId,
      },
    },
  );
  return data;
};

const findAverageResolutionTime = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<AverageResolution>(
    "/average-resolution-time",
    {
      params: {
        manufacturingPlantId,
      },
    },
  );
  return data;
};

const findMonthlyGlobalTrend = async ({
  manufacturingPlantId,
  userId,
  isAdmin = false,
}: {
  manufacturingPlantId: string;
  userId: number;
  isAdmin?: boolean;
}) => {
  const { data } = await api.get<MonthlyGlobalTrend[]>(
    "/monthly-global-trend",
    {
      params: {
        manufacturingPlantId,
        userId,
        isAdmin: isAdmin ? "true" : "false",
      },
    },
  );
  return data;
};

const findMonthlyTypeTrend = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<MonthlyTypeTrend[]>("/monthly-type-trend", {
    params: {
      manufacturingPlantId,
    },
  });
  return data;
};

const findMonthlySubtypeTrend = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<MonthlySubtypeTrend[]>(
    "/monthly-subtype-trend",
    {
      params: {
        manufacturingPlantId,
      },
    },
  );
  return data;
};

const findOpenEvidence = async ({
  manufacturingPlantId,
  userId,
}: {
  manufacturingPlantId: string;
  userId: number;
}) => {
  const { data } = await api.get<OpenEvidence[]>("/open-evidences", {
    params: {
      manufacturingPlantId,
      userId,
    },
  });
  return data;
};

const findRecentEvidences = async ({
  manufacturingPlantId,
  userId,
}: {
  manufacturingPlantId: string;
  userId: number;
}) => {
  const { data } = await api.get<RecentEvidence[]>("/recent-evidences", {
    params: {
      manufacturingPlantId,
      userId,
    },
  });
  return data;
};

const findAverageResolutionTimeByUser = async ({
  manufacturingPlantId,
  userId,
}: {
  manufacturingPlantId: string;
  userId: number;
}) => {
  const { data } = await api.get<AverageResolutionByUser>(
    "/average-resolution-time-by-user",
    {
      params: {
        manufacturingPlantId,
        userId,
      },
    },
  );
  return data;
};

const findAverageResolutionTimeByUserAssigned = async ({
  manufacturingPlantId,
  userId,
}: {
  manufacturingPlantId: string;
  userId: number;
}) => {
  const { data } = await api.get<AverageResolutionByUserAssigned>(
    "/average-resolution-time-by-user",
    {
      params: {
        manufacturingPlantId,
        userId,
        assigned: "true",
      },
    },
  );
  return data;
};

const findTypeEvidenceByUser = async ({
  manufacturingPlantId,
  userId,
}: {
  manufacturingPlantId: string;
  userId: number;
}) => {
  const { data } = await api.get<TypeEvidenceByUser[]>(
    "type-evidence-by-user",
    {
      params: {
        manufacturingPlantId,
        userId,
        assigned: "true",
      },
    },
  );
  return data;
};

const findPendingBySeniorityByUser = async ({
  manufacturingPlantId,
  userId,
}: {
  manufacturingPlantId: string;
  userId: number;
}) => {
  const { data } = await api.get<PendingBySeniorityByUser[]>(
    "pending-by-seniority-by-user",
    {
      params: {
        manufacturingPlantId,
        userId,
      },
    },
  );
  return data;
};

const findMainTypesGlobalTrend = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<MainTypesGlobalTrend[]>(
    "/main-types-global-trend",
    {
      params: {
        manufacturingPlantId,
      },
    },
  );
  return data;
};

const findMainTypesGlobalTrendDetails = async ({
  manufacturingPlantId,
  mainTypeId,
}: {
  manufacturingPlantId: string;
  mainTypeId: string;
}) => {
  const { data } = await api.get<MainTypesGlobalTrendDetails[]>(
    `/main-types-global-trend-details`,
    {
      params: {
        manufacturingPlantId,
        mainTypeId,
      },
    },
  );
  return data;
};

const findPercentageComplianceByZone = async ({
  manufacturingPlantId,
  mainTypeId,
}: {
  manufacturingPlantId: string;
  mainTypeId: string;
}) => {
  const { data } = await api.get<MainTypesGlobalTrendDetailsZone[]>(
    `/percentage-compliance-by-zone`,
    {
      params: {
        manufacturingPlantId,
        mainTypeId,
      },
    },
  );
  return data;
};

const findBusinessIntelligenceEpp = async ({
  manufacturingPlantId,
}: {
  manufacturingPlantId: string;
}) => {
  const { data } = await api.get<BusinessIntelligenceEpp>(
    `/business-intelligence/epp`,
    {
      params: {
        manufacturingPlantId,
      },
    },
  );
  return data;
};

export const DashboardService = {
  findBusinessIntelligenceEpp,
  findPercentageComplianceByZone,
  findMainTypesGlobalTrendDetails,
  findMainTypesGlobalTrend,
  findPendingBySeniorityByUser,
  findTypeEvidenceByUser,
  findAverageResolutionTimeByUserAssigned,
  findAverageResolutionTimeByUser,
  findRecentEvidences,
  findOpenEvidence,
  findMonthlyTypeTrend,
  findMonthlySubtypeTrend,
  findMonthlyGlobalTrend,
  findAverageResolutionTime,
  findRankingOfResponsibles,
  findGlobalSummary,
  findCriticalZones,
  findAccidentRate,
  findTopUsersByPlant,
  findAllEvidencesByMonth,
  findAllStatus,
  findAllZones,
  findAllMainTypes,
  findOpendVsClosed,
  findMyEvidences,
};
