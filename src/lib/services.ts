import { api } from './api';

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
  static async getAthletes() {
    try {
      console.log('Fetching athletes from API...');
      const response = await api.get('/users/athletes');
      console.log('Athletes response:', response);
      
      // Transform backend data to match frontend interface
      const transformedAthletes = response.athletes.map((athlete: any) => ({
        id: athlete.user.id, // Use user.id for UI display
        athleteId: athlete.id, // Keep athlete profile ID for API operations
        nome: athlete.user.name,
        email: athlete.user.email,
        telefone: athlete.user.phone || '',
        idade: athlete.user.age || 0,
        nivel: this.mapLevel(athlete.level),
        status: this.mapStatus(athlete.status),
        foto: athlete.user.avatar || '',
        planoAtual: athlete.currentPlan?.name || undefined,
        progressoAtual: athlete.currentProgress || 0,
        treinosConcluidos: athlete.completedTrainings || 0,
        tempoMedio: athlete.averageTime || '',
        ritmoMedio: athlete.averagePace || '',
        dataCadastro: new Date(athlete.user.createdAt || new Date())
      }));
      
      console.log('Transformed athletes:', transformedAthletes);
      return transformedAthletes;
    } catch (error) {
      console.error('Error in getAthletes:', error);
      throw error;
    }
  }

  static async createAthlete(athleteData: any) {
    try {
      console.log('Creating athlete:', athleteData);
      const response = await api.post('/auth/register-athlete', {
        name: athleteData.nome,
        email: athleteData.email,
        phone: athleteData.telefone,
        age: athleteData.idade
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
        age: athleteData.idade
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

  private static mapStatus(status: string): 'Pendente' | 'Ativo' | 'Inativo' {
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
    const response = await api.get('/plans/coach/my-plans');
    return response.plans.map((plan: any) => ({
      id: plan.id,
      nome: plan.name,
      categoria: this.mapCategory(plan.category),
      duracao: plan.duration,
      diasPorSemana: plan.daysPerWeek,
      totalAlunos: plan._count.athletes,
      status: this.mapPlanStatus(plan.status),
      progresso: Math.floor(Math.random() * 100), // Calculate real progress later
      criadoEm: new Date(plan.createdAt),
      criadoPor: 'Você',
      programacao: [] // Load separately when needed
    }));
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
    return api.get(`/physical-tests/stats/${athleteId}`);
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