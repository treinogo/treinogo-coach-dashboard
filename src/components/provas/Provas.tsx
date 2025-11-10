import { useState, useEffect } from 'react';
import { Flag, Plus, MapPin, Calendar, Filter, Users, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ProvasService } from '../../lib/services';
import { toast } from 'sonner';

const MESES = [
  { numero: 1, nome: 'Janeiro', abrev: 'JAN' },
  { numero: 2, nome: 'Fevereiro', abrev: 'FEV' },
  { numero: 3, nome: 'Março', abrev: 'MAR' },
  { numero: 4, nome: 'Abril', abrev: 'ABR' },
  { numero: 5, nome: 'Maio', abrev: 'MAI' },
  { numero: 6, nome: 'Junho', abrev: 'JUN' },
  { numero: 7, nome: 'Julho', abrev: 'JUL' },
  { numero: 8, nome: 'Agosto', abrev: 'AGO' },
  { numero: 9, nome: 'Setembro', abrev: 'SET' },
  { numero: 10, nome: 'Outubro', abrev: 'OUT' },
  { numero: 11, nome: 'Novembro', abrev: 'NOV' },
  { numero: 12, nome: 'Dezembro', abrev: 'DEZ' },
];

const ESTADOS_BRASILEIROS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
  'SP', 'SE', 'TO'
];

const DISTANCIAS_DISPONIVEIS = ['3km', '5km', '10km', '15km', '21km', '42km'];

export function Provas() {
  // UI States  
  const [showNovaProva, setShowNovaProva] = useState(false);
  const [nomeProva, setNomeProva] = useState('');
  const [distanciasSelecionadas, setDistanciasSelecionadas] = useState<string[]>([]);
  const [distanciaOutra, setDistanciaOutra] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [dataProva, setDataProva] = useState('');
  const [turnoProva, setTurnoProva] = useState('Manhã');
  const [linkProva, setLinkProva] = useState('');
  const [anoFiltro, setAnoFiltro] = useState('2024');
  const [mesSelecionado, setMesSelecionado] = useState('11');
  
  // API States
  const [provas, setProvas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load races from API
  useEffect(() => {
    const loadProvas = async () => {
      try {
        setLoading(true);
        const provasData = await ProvasService.getRaces();
        setProvas(provasData);
      } catch (error) {
        console.error('Erro ao carregar provas:', error);
        toast.error('Erro ao carregar provas');
        setProvas([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadProvas();
  }, []);

  const handleToggleDistancia = (distancia: string) => {
    setDistanciasSelecionadas(prev =>
      prev.includes(distancia)
        ? prev.filter(d => d !== distancia)
        : [...prev, distancia]
    );
  };

  const handleSalvarProva = async () => {
    const todasDistancias = [...distanciasSelecionadas];
    if (distanciaOutra.trim()) {
      todasDistancias.push(distanciaOutra.trim());
    }

    if (!nomeProva || !cidade || !estado || !dataProva || todasDistancias.length === 0) {
      toast.error('Erro ao criar prova', {
        description: 'Preencha todos os campos obrigatórios e selecione pelo menos uma distância',
      });
      return;
    }

    try {
      await ProvasService.createRace({
        nome: nomeProva,
        distancias: todasDistancias,
        cidade,
        estado,
        data: new Date(dataProva),
        turno: turnoProva,
        link: linkProva
      });

      // Reload races list
      const provasData = await ProvasService.getRaces();
      setProvas(provasData);

      toast.success('✅ Prova cadastrada com sucesso', {
        description: `${nomeProva} foi adicionada ao calendário`,
      });

      setShowNovaProva(false);
      setNomeProva('');
      setDistanciasSelecionadas([]);
      setDistanciaOutra('');
      setCidade('');
      setEstado('');
      setDataProva('');
      setTurnoProva('Manhã');
      setLinkProva('');
    } catch (error) {
      console.error('Erro ao criar prova:', error);
      toast.error('❌ Erro ao criar prova', {
        description: 'Tente novamente.',
      });
    }
  };

  const provasFiltradas = provas.filter((prova: any) => {
    const matchAno = prova.ano === Number(anoFiltro);
    const matchMes = prova.mes === Number(mesSelecionado);
    return matchAno && matchMes;
  });

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(data);
  };

  const getDistanciaColor = (distancia: string) => {
    switch (distancia) {
      case '3km':
        return 'bg-green-100 text-green-700 border-green-300';
      case '5km':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case '10km':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case '15km':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case '21km':
        return 'bg-red-100 text-red-700 border-red-300';
      case '42km':
        return 'bg-pink-100 text-pink-700 border-pink-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const totalProvas = provas.filter((p: any) => p.ano === Number(anoFiltro)).length;
  const provasProximoMes = provas.filter((p: any) => {
    const hoje = new Date();
    const proximoMes = hoje.getMonth() + 1;
    return p.mes === proximoMes && p.ano === Number(anoFiltro);
  }).length;  // Contar provas por mês
  const provasPorMes = MESES.map(mes => ({
    ...mes,
    quantidade: provas.filter((p: any) => p.mes === mes.numero && p.ano === Number(anoFiltro)).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-orange-600" />
                Calendário de Provas
              </CardTitle>
              <CardDescription className="mt-2">
                Gerencie o calendário de provas e eventos de corrida
              </CardDescription>
            </div>
            <Button onClick={() => setShowNovaProva(true)} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Prova
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Provas em {anoFiltro}</p>
                <p className="text-2xl text-gray-900">{totalProvas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Este Mês</p>
                <p className="text-2xl text-gray-900">{provasFiltradas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Próximo Mês</p>
                <p className="text-2xl text-gray-900">{provasProximoMes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro por Ano */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Filter className="w-4 h-4 text-gray-500" />
            <Label htmlFor="ano-filtro">Filtrar por Ano:</Label>
            <Select value={anoFiltro} onValueChange={setAnoFiltro}>
              <SelectTrigger id="ano-filtro" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs por Mês */}
      <Card>
        <CardHeader>
          <CardTitle>Provas por Mês</CardTitle>
          <CardDescription>
            Navegue pelos meses para visualizar as provas programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mesSelecionado} onValueChange={setMesSelecionado}>
            <TabsList className="grid grid-cols-6 lg:grid-cols-12 w-full h-auto gap-1">
              {provasPorMes.map(mes => (
                <TabsTrigger 
                  key={mes.numero} 
                  value={mes.numero.toString()}
                  className="flex flex-col py-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white"
                >
                  <span className="text-xs">{mes.abrev}</span>
                  {mes.quantidade > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="mt-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {mes.quantidade}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {MESES.map(mes => (
              <TabsContent key={mes.numero} value={mes.numero.toString()} className="mt-6">
                <div className="space-y-4">
                  {provasFiltradas.length === 0 ? (
                    <div className="text-center py-12">
                      <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Nenhuma prova em {mes.nome} de {anoFiltro}
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowNovaProva(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Prova
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {provasFiltradas.map(prova => (
                        <Card key={prova.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg text-gray-900">
                                  {prova.nome}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{prova.cidade}, {prova.estado}</span>
                                </div>
                              </div>
                              <Flag className="w-5 h-5 text-orange-600" />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-900">{formatarData(prova.data)}</span>
                            </div>

                            <div>
                              <p className="text-sm text-gray-600 mb-2">Distâncias disponíveis:</p>
                              <div className="flex flex-wrap gap-2">
                                {prova.distancias.map((distancia: string) => (
                                  <Badge 
                                    key={distancia} 
                                    className={getDistanciaColor(distancia)}
                                    variant="outline"
                                  >
                                    {distancia}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="pt-3 border-t border-gray-200">
                              <Button variant="outline" size="sm" className="w-full">
                                <Users className="w-4 h-4 mr-2" />
                                Inscrever Alunos
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Dica */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 mb-1">
                <span className="font-medium">💡 Dica:</span> Mantenha o calendário atualizado
              </p>
              <p className="text-xs text-gray-600">
                Cadastre provas com antecedência para que seus alunos possam se planejar e se preparar adequadamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Nova Prova */}
      <Dialog open={showNovaProva} onOpenChange={setShowNovaProva}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Prova</DialogTitle>
            <DialogDescription>
              Cadastre uma nova prova no calendário de eventos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome-prova">
                Nome da Prova <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome-prova"
                placeholder="Ex: Maratona de São Paulo"
                value={nomeProva}
                onChange={(e) => setNomeProva(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-prova">
                  Data <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="data-prova"
                  type="date"
                  value={dataProva}
                  onChange={(e) => setDataProva(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="turno-prova">
                  Turno <span className="text-red-500">*</span>
                </Label>
                <Select value={turnoProva} onValueChange={setTurnoProva}>
                  <SelectTrigger id="turno-prova">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manhã">Manhã</SelectItem>
                    <SelectItem value="Tarde">Tarde</SelectItem>
                    <SelectItem value="Noite">Noite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cidade">
                  Cidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cidade"
                  placeholder="Ex: São Paulo"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="UF" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_BRASILEIROS.map(uf => (
                      <SelectItem key={uf} value={uf}>
                        {uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 border-t pt-4">
              <Label>
                Distâncias Disponíveis <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500">
                Selecione as distâncias mais comuns ou adicione uma personalizada
              </p>
              <div className="grid grid-cols-3 gap-3">
                {DISTANCIAS_DISPONIVEIS.map(distancia => (
                  <div 
                    key={distancia}
                    className={`flex items-center space-x-2 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                      distanciasSelecionadas.includes(distancia)
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleDistancia(distancia)}
                  >
                    <Checkbox
                      id={`distancia-${distancia}`}
                      checked={distanciasSelecionadas.includes(distancia)}
                      onCheckedChange={() => handleToggleDistancia(distancia)}
                    />
                    <Label 
                      htmlFor={`distancia-${distancia}`}
                      className="cursor-pointer flex-1"
                    >
                      {distancia}
                    </Label>
                  </div>
                ))}
              </div>
              
              {/* Campo para distâncias não convencionais */}
              <div className="space-y-2">
                <Label htmlFor="distancia-outra" className="text-sm">
                  Outra distância (opcional)
                </Label>
                <Input
                  id="distancia-outra"
                  placeholder="Ex: 7km, 12km, 50km, 100km"
                  value={distanciaOutra}
                  onChange={(e) => setDistanciaOutra(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Digite uma distância personalizada para corridas não convencionais
                </p>
              </div>

              {(distanciasSelecionadas.length > 0 || distanciaOutra.trim()) && (
                <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-xs text-blue-900">
                    {distanciasSelecionadas.length + (distanciaOutra.trim() ? 1 : 0)} distância(s) selecionada(s)
                    {distanciaOutra.trim() && (
                      <span className="ml-1 font-medium">({distanciaOutra.trim()} incluída)</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Campo de link opcional */}
            <div className="space-y-2">
              <Label htmlFor="link-prova">
                Link Oficial ou Inscrição (opcional)
              </Label>
              <Input
                id="link-prova"
                type="url"
                placeholder="https://exemplo.com/inscricao"
                value={linkProva}
                onChange={(e) => setLinkProva(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Link para o site oficial da prova ou página de inscrição
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-900">
                <span className="font-medium">ℹ️ Informação:</span> Após cadastrar a prova,
                você poderá inscrever seus alunos e acompanhar seus resultados.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNovaProva(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarProva} className="bg-orange-600 hover:bg-orange-700">
              Cadastrar Prova
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
