import { api } from './api';
import { Aluno } from '../types';

// Dashboard Services
export class DashboardService {
  static async getMetrics() {
    return api.get('/dashboard/metrics');
  }

  static async getTrainingStats(year?: number) {
    const params = year ? `?year=${year}` : '';
    return api.get(`/dashboard/training-stats${params}`);
  }

  static async getChallengeProgress() {
    return api.get('/dashboard/challenge-progress');
  }

  static async getUpcomingRaces(months = 3) {
    return api.get(`/dashboard/upcoming-races?months=${months}`);
  }

  static async getRecentActivities(limit = 10) {
    return api.get(`/dashboard/recent-activities?limit=${limit}`);
  }
}

// Athletes Services
export class AlunosService {
  static async getAthletes(): Promise<Aluno[]> {
    try {
      const response = await api.get('/users/athletes');
      
      // Check if response has athletes property
      if (!response || !response.athletes) {
        console.error('Invalid API response structure:', response);
        return [];
      }
      
      return response.athletes.map((athlete: any) => ({
        id: athlete.user.id,
        athleteId: athlete.id, // Store the athlete profile ID for assignments
        nome: athlete.user.name,
        email: athlete.user.email,
        foto: athlete.user.avatar,
        telefone: athlete.user.phone || '',
        idade: athlete.user.age || 0,
        status: AlunosService.mapStatusFromBackend(athlete.status),
        nivel: AlunosService.mapLevelFromBackend(athlete.level),
        planoAtual: athlete.currentPlan?.name || null,
        treinosConcluidos: athlete.completedTrainings || 0,
        tempoMedio: athlete.averageTime || '-',
        ritmoMedio: athlete.averagePace || '-',
        progressoAtual: athlete.currentProgress || 0,
        dataCadastro: new Date(athlete.user.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching athletes:', error);
      throw error;
    }
  }  static async createAthlete(athleteData: any) {
    try {
      console.log('Creating athlete:', athleteData);
      const response = await api.post('/auth/register-athlete', {
        name: athleteData.nome,
        email: athleteData.email,
        phone: athleteData.telefone,
        age: athleteData.idade,
        level: AlunosService.mapLevelToBackend(athleteData.nivel),
        status: AlunosService.mapStatusToBackend(athleteData.status)
      });
      console.log('Create athlete response:', response);
      return response;
    } catch (error) {
      console.error('Error creating athlete:', error);
      throw error;
    }
  }

  static async updateAthlete(id: string, athleteData: any) {
    try {
      console.log('Updating athlete:', id, athleteData);
      const response = await api.put(`/users/${id}`, {
        name: athleteData.nome,
        email: athleteData.email,
        phone: athleteData.telefone,
        age: athleteData.idade,
        level: AlunosService.mapLevelToBackend(athleteData.nivel),
        status: AlunosService.mapStatusToBackend(athleteData.status)
      });
      console.log('Update athlete response:', response);
      return response;
    } catch (error) {
      console.error('Error updating athlete:', error);
      throw error;
    }
  }

  static async deleteAthlete(id: string) {
    try {
      console.log('Deleting athlete:', id);
      const response = await api.delete(`/users/${id}`);
      console.log('Delete athlete response:', response);
      return response;
    } catch (error) {
      console.error('Error deleting athlete:', error);
      throw error;
    }
  }

  private static mapLevel(level: string): 'Iniciante' | 'Intermediário' | 'Avançado' {
    const mapping = {
      'BEGINNER': 'Iniciante' as const,
      'INTERMEDIATE': 'Intermediário' as const,
      'ADVANCED': 'Avançado' as const
    };
    return mapping[level as keyof typeof mapping] || 'Iniciante';
  }

  static async getAthleteEvolution(athleteId: string, weeks = 6) {
    try {
      console.log('Fetching athlete evolution:', athleteId);
      const response = await api.get(`/users/${athleteId}/evolution?weeks=${weeks}`);
      console.log('Evolution response:', response);
      return response;
    } catch (error) {
      console.error('Error getting athlete evolution:', error);
      throw error;
    }
  }

  static async getAthletePlanHistory(athleteId: string) {
    try {
      console.log('Fetching athlete plan history:', athleteId);
      const response = await api.get(`/users/${athleteId}/plan-history`);
      console.log('Plan history response:', response);
      return response;
    } catch (error) {
      console.error('Error getting athlete plan history:', error);
      throw error;
    }
  }

  static async getAthleteTrainings(athleteId: string, planId?: string, limit = 10) {
    try {
      const params = new URLSearchParams();
      if (planId) params.append('planId', planId);
      params.append('limit', limit.toString());
      
      const queryString = params.toString();
      const response = await api.get(`/trainings/athlete/${athleteId}${queryString ? `?${queryString}` : ''}`);
      console.log('Athlete trainings response:', response);
      return response;
    } catch (error) {
      console.error('Error getting athlete trainings:', error);
      throw error;
    }
  }

  private static mapStatus(status: string): 'Pendente' | 'Ativo' | 'Inativo' {
    const mapping = {
      'PENDING': 'Pendente' as const,
      'ACTIVE': 'Ativo' as const,
      'INACTIVE': 'Inativo' as const
    };
    return mapping[status as keyof typeof mapping] || 'Pendente';
  }

  private static mapLevelToBackend(nivel: string): string {
    const mapping = {
      'Iniciante': 'BEGINNER',
      'Intermediário': 'INTERMEDIATE', 
      'Avançado': 'ADVANCED'
    };
    return mapping[nivel as keyof typeof mapping] || 'BEGINNER';
  }

  private static mapStatusToBackend(status: string): string {
    const mapping = {
      'Pendente': 'PENDING',
      'Ativo': 'ACTIVE',
      'Inativo': 'INACTIVE'
    };
    return mapping[status as keyof typeof mapping] || 'PENDING';
  }

  // Static methods for mapping backend data to frontend
  private static mapLevelFromBackend(level?: string): 'Iniciante' | 'Intermediário' | 'Avançado' {
    if (!level) return 'Iniciante';
    const mapping = {
      'BEGINNER': 'Iniciante' as const,
      'INTERMEDIATE': 'Intermediário' as const,
      'ADVANCED': 'Avançado' as const
    };
    return mapping[level as keyof typeof mapping] || 'Iniciante';
  }

  private static mapStatusFromBackend(status?: string): 'Pendente' | 'Ativo' | 'Inativo' {
    if (!status) return 'Pendente';
    const mapping = {
      'PENDING': 'Pendente' as const,
      'ACTIVE': 'Ativo' as const,
      'INACTIVE': 'Inativo' as const
    };
    return mapping[status as keyof typeof mapping] || 'Pendente';
  }
}

// Training Plans Services
export class PlanosService {
  static async getPlans() {
    try {
      const response = await api.get('/plans/coach/my-plans');
      console.log('Response from API:', response);
      return response.plans; // O ApiClient já faz response.json(), então não precisa de .data
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
      throw error;
    }
  }

  static async getPlano(id: string) {
    try {
      const response = await api.get(`/plans/${id}`);
      return response.plan; // O ApiClient já faz response.json(), então não precisa de .data
    } catch (error) {
      console.error('Erro ao buscar plano:', error);
      throw error;
    }
  }

  static async createPlan(planData: any) {
    return api.post('/plans', planData);
  }

  static async updatePlan(id: string, planData: any) {
    return api.put(`/plans/${id}`, planData);
  }

  static async deletePlan(id: string) {
    return api.delete(`/plans/${id}`);
  }

  static async assignPlanToAthletes(planId: string, athleteIds: string[]) {
    return api.post(`/plans/${planId}/assign-multiple`, { athleteIds });
  }

  static async getWeeklyProgramming(planId: string) {
    return api.get(`/plans/${planId}/weekly-programming`);
  }

  static async updateWeeklyProgramming(planId: string, week: number, programming: any) {
    return api.put(`/plans/${planId}/weekly-programming/${week}`, programming);
  }

  static async getPlanProgress(planId: string) {
    try {
      const response = await api.get(`/plans/${planId}/progress`);
      console.log('Plan progress response:', response);
      return response.planProgress;
    } catch (error) {
      console.error('Error fetching plan progress:', error);
      throw error;
    }
  }

  private static mapCategory(category: string): string {
    const mapping = {
      'BEGINNER': 'Iniciante',
      'INTERMEDIATE': 'Intermediário', 
      'ADVANCED': 'Avançado',
      'FIVE_K': '5K',
      'TEN_K': '10K',
      'HALF_MARATHON': 'Meia Maratona',
      'MARATHON': 'Maratona'
    };
    return mapping[category as keyof typeof mapping] || category;
  }

  private static mapPlanStatus(status: string): 'Ativo' | 'Rascunho' | 'Arquivado' {
    const mapping = {
      'ACTIVE': 'Ativo' as const,
      'DRAFT': 'Rascunho' as const,
      'ARCHIVED': 'Arquivado' as const
    };
    return mapping[status as keyof typeof mapping] || 'Rascunho';
  }
}

// Challenges Services  
export class DesafiosService {
  static async getChallenges() {
    const response = await api.get('/challenges');
    return response.challenges.map((challenge: any) => ({
      id: challenge.id,
      nome: challenge.name,
      objetivo: challenge.objective,
      duracao: challenge.duration,
      dataInicio: new Date(challenge.startDate),
      dataFim: new Date(challenge.endDate),
      participantes: challenge.participants?.map((p: any) => p.athlete?.user?.id || p.athleteId) || [],
      recompensa: challenge.reward,
      status: this.mapChallengeStatus(challenge.status),
      progresso: challenge.participants?.reduce((acc: any, p: any) => {
        const athleteId = p.athlete?.user?.id || p.athleteId;
        if (athleteId) acc[athleteId] = p.progress || 0;
        return acc;
      }, {}) || {},
      ranking: challenge.participants?.length > 0 
        ? challenge.participants
            .sort((a: any, b: any) => (b.points || 0) - (a.points || 0))
            .map((p: any) => ({
              alunoId: p.athlete?.user?.id || p.athleteId,
              pontos: p.points || 0
            }))
        : []
    }));
  }

  static async createChallenge(challengeData: any) {
    return api.post('/challenges', {
      name: challengeData.nome,
      objective: challengeData.objetivo,
      duration: challengeData.duracao,
      startDate: challengeData.dataInicio,
      endDate: challengeData.dataFim,
      reward: challengeData.recompensa,
      participantIds: challengeData.participantes
    });
  }

  static async updateChallenge(id: string, challengeData: any) {
    return api.put(`/challenges/${id}`, challengeData);
  }

  static async deleteChallenge(id: string) {
    return api.delete(`/challenges/${id}`);
  }

  static async addParticipant(challengeId: string, athleteId: string) {
    return api.post(`/challenges/${challengeId}/participants`, { athleteId });
  }

  static async updateParticipantProgress(challengeId: string, participantId: string, progress: number, points?: number) {
    return api.put(`/challenges/${challengeId}/participants/${participantId}`, { progress, points });
  }

  private static mapChallengeStatus(status: string): 'Ativo' | 'Concluído' | 'Cancelado' {
    const mapping = {
      'ACTIVE': 'Ativo' as const,
      'COMPLETED': 'Concluído' as const,
      'CANCELLED': 'Cancelado' as const
    };
    return mapping[status as keyof typeof mapping] || 'Ativo';
  }
}

// Physical Tests Services
export class TestesService {
  static async getTests() {
    return api.get('/physical-tests');
  }

  static async getAthleteTests(athleteId: string) {
    return api.get(`/physical-tests/athlete/${athleteId}`);
  }

  static async createTest(testData: any) {
    return api.post('/physical-tests', {
      athleteId: testData.alunoId,
      testType: this.mapTestType(testData.tipoTeste),
      pace: testData.pace,
      finalTime: testData.tempoFinal,
      distance: testData.distancia,
      testDate: testData.data
    });
  }

  static async updateTest(id: string, testData: any) {
    return api.put(`/physical-tests/${id}`, testData);
  }

  static async deleteTest(id: string) {
    return api.delete(`/physical-tests/${id}`);
  }

  static async getAthleteStats(athleteId: string) {
    try {
      console.log('Fetching athlete physical test stats:', athleteId);
      const response = await api.get(`/physical-tests/stats/${athleteId}`);
      console.log('Physical test stats response:', response);
      return response;
    } catch (error) {
      console.error('Error getting athlete stats:', error);
      throw error;
    }
  }

  private static mapTestType(tipoTeste: string): string {
    const mapping = {
      '12 minutos': 'TWELVE_MINUTES',
      '3km': 'THREE_KM', 
      '5km': 'FIVE_KM'
    };
    return mapping[tipoTeste as keyof typeof mapping] || tipoTeste;
  }
}

// Races Services
export class ProvasService {
  static async getRaces(filters?: any) {
    const params = new URLSearchParams();
    if (filters?.month) params.append('month', filters.month);
    if (filters?.year) params.append('year', filters.year);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);
    
    const queryString = params.toString();
    const response = await api.get(`/races${queryString ? `?${queryString}` : ''}`);
    
    return response.races.map((race: any) => ({
      id: race.id,
      nome: race.name,
      distancias: race.distances,
      cidade: race.city,
      estado: race.state,
      data: new Date(race.raceDate),
      mes: new Date(race.raceDate).getMonth() + 1,
      ano: new Date(race.raceDate).getFullYear(),
      turno: this.mapTimeOfDay(race.timeOfDay),
      link: race.link
    }));
  }

  static async createRace(raceData: any) {
    return api.post('/races', {
      name: raceData.nome,
      distances: raceData.distancias,
      city: raceData.cidade,
      state: raceData.estado,
      raceDate: raceData.data,
      timeOfDay: this.mapTimeOfDayToBackend(raceData.turno),
      link: raceData.link
    });
  }

  static async updateRace(id: string, raceData: any) {
    return api.put(`/races/${id}`, raceData);
  }

  static async deleteRace(id: string) {
    return api.delete(`/races/${id}`);
  }

  static async getUpcomingRaces(months = 3) {
    return api.get(`/races/upcoming/${months}`);
  }

  static async searchRaces(query: string) {
    return api.get(`/races/search?q=${encodeURIComponent(query)}`);
  }

  private static mapTimeOfDay(timeOfDay?: string): 'Manhã' | 'Tarde' | 'Noite' | undefined {
    if (!timeOfDay) return undefined;
    const mapping = {
      'MORNING': 'Manhã' as const,
      'AFTERNOON': 'Tarde' as const,
      'EVENING': 'Noite' as const
    };
    return mapping[timeOfDay as keyof typeof mapping];
  }

  private static mapTimeOfDayToBackend(turno?: string): string | undefined {
    if (!turno) return undefined;
    const mapping = {
      'Manhã': 'MORNING',
      'Tarde': 'AFTERNOON', 
      'Noite': 'EVENING'
    };
    return mapping[turno as keyof typeof mapping];
  }
}

// Notifications Services
export class NotificationsService {
  static async getNotifications(unreadOnly = false, limit = 20) {
    try {
      const params = new URLSearchParams();
      if (unreadOnly) params.append('unreadOnly', 'true');
      params.append('limit', limit.toString());
      
      const queryString = params.toString();
      const response = await api.get(`/notifications${queryString ? `?${queryString}` : ''}`);
      return response.notifications || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  static async getUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      return response.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`, {});
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead() {
    try {
      const response = await api.put('/notifications/mark-all-read', {});
      return response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}