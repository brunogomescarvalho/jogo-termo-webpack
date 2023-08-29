import { IProgresso } from "./IProgresso";
import { LocalStorageService } from "../../services/local-storage-service";

export class Progresso {

    private progresso: IProgresso

    constructor(private repositorio: LocalStorageService) {

        this.progresso = {
            jogos: 0,
            porcentagemVitorias: 0,
            sequenciaVitorias: 0,
            melhorSequencia: 0,
            linhaDaJogada: [] = [0, 0, 0, 0, 0],
            erros: 0
        }
    }

    public obterDados(): IProgresso {
        return this.repositorio.obterDados();
    }

    public atualizarJogada(acertou: boolean, linha?: number): void {

        let dados = this.obterDados() as IProgresso;

        this.atualizarDados(dados, acertou, linha);

        this.repositorio.salvarDados(this.progresso);
    }

    private atualizarDados(dados: IProgresso, acertou: boolean, linha?: number): void {

        if (dados)
            this.progresso = dados;

        this.progresso.jogos++;

        if (acertou)
            this.progresso.linhaDaJogada[linha!]++;
        else
            this.progresso.erros++;

        this.calcularSequencia(acertou);

        this.calcularPorcentagem();
    }

    private calcularPorcentagem(): void {

        if (this.progresso.erros == 0)
            this.progresso.porcentagemVitorias = 100;
        else {
            const valor = this.progresso.erros / this.progresso.jogos;
            this.progresso.porcentagemVitorias = 100 - Math.floor(100 * valor);
        }
    }

    private calcularSequencia(acertou: boolean): void {

        if (acertou)
            this.progresso.sequenciaVitorias++;
        else
            this.progresso.sequenciaVitorias = 0;

        if (acertou && this.progresso.jogos == 1)
            this.progresso.melhorSequencia = 1;

        if (this.progresso.sequenciaVitorias > this.progresso.melhorSequencia)
            this.progresso.melhorSequencia = this.progresso.sequenciaVitorias;
    }
}
