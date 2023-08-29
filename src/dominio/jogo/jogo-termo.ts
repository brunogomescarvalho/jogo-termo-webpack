import { acervo } from "./acervo-termo"

export class jogo {

    private listaPalavras: string[];
    private palavra: string;

    constructor(private acervo: acervo) {
        this.listaPalavras = this.acervo.palavras;

        this.sortearPalavra();

        console.log(this.palavra)
    }

    public getPalavra() {
        return this.palavra;
    }

    public verificarJogada(palavraJogada: string): resultado[] {
        let resultados: resultado[] = [];

        for (let i = 0; i < this.palavra.length; i++) {
            if (this.palavra[i] === palavraJogada[i]) {
                resultados.push(resultado.Acerto);
            }
            else if (this.palavra.includes(palavraJogada[i])) {
                resultados.push(resultado.Erro);
            }
            else resultados.push(resultado.Inexistente);
        }
        return resultados;
    }

    public acertou(palavraJogada: string) {
        return palavraJogada == this.palavra;
    }

    private sortearPalavra(): void {
        this.palavra = this.listaPalavras[Math.floor(Math.random() * this.listaPalavras.length + 1)]
            .toUpperCase();
    }
}

export enum resultado {
    Acerto,
    Erro,
    Inexistente,
} 