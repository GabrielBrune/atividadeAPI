import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MARCA } from './marca.entity';
import { RetornoCadastroDTO, RetornoObjDTO } from 'src/dto/retorno.dto';
import {v4 as uuid} from 'uuid';
import { CriaMarcaDTO } from './dto/criaMarca.dto';
import { listaMarcaDTO } from './dto/listaMarca.dto';
import { listaMarcaFornDTO } from './dto/listaMarcaForn.dto';

@Injectable()
export class MarcaService {
  constructor(
    @Inject('MARCA_REPOSITORY')
    private marcaRepository: Repository<MARCA>,
  ) {}

  async listar(): Promise<MARCA[]> {
    return this.marcaRepository.find();
  }

  async inserir(dados: CriaMarcaDTO): Promise<RetornoCadastroDTO>{
    let marca = new MARCA();
        marca.ID = uuid();
        marca.NOME = dados.NOME;

    return this.marcaRepository.save(marca)
    .then((result) => {
      return <RetornoCadastroDTO>{
        id: marca.ID,
        message: "Marca cadastrada!"
      };
    })
    .catch((error) => {
      return <RetornoCadastroDTO>{
        id: "",
        message: "Houve um erro ao cadastrar." + error.message
      };
    })

    
  }

  localizarID(ID: string): Promise<MARCA> {
    return this.marcaRepository.findOne({
      where: {
        ID,
      },
    });
  }

  listaNomes(): Promise<any[]> {
    return this.marcaRepository.find({
      select:{
        NOME:true,
      }
    });
  }

  async listaComForn(): Promise<any[]> {
    var retorno = await (this.marcaRepository
    .createQueryBuilder('marca')
    .select('marca.id','ID')
    .addSelect('marca.nome','nome_marca')
    .addSelect('pes_f.nome','nome_fornecedor')
    .leftJoinAndSelect('for_marca', 'fm','fm.idmarca = marca.id')  
    .leftJoinAndSelect('fornecedor', 'for','for.id = fm.idfornecedor')    
    .leftJoinAndSelect('pessoa', 'pes_f','for.idpessoa = pes_f.id')     
    .getRawMany());    

    const listaRetorno = retorno.map(
      marca => new listaMarcaFornDTO(
        marca.ID,
        marca.nome_marca,
        marca.nome_fornecedor
      )
    );

    return listaRetorno;    
  }

  async remover(id: string): Promise<RetornoObjDTO> {
    const marca = await this.localizarID(id);
    
    return this.marcaRepository.remove(marca)
    .then((result) => {
      return <RetornoObjDTO>{
        return: marca,
        message: "Marca excluida!"
      };
    })
    .catch((error) => {
      return <RetornoObjDTO>{
        return: marca,
        message: "Houve um erro ao excluir." + error.message
      };
    });  
  }

  async alterar(id: string, dados: CriaMarcaDTO): Promise<RetornoCadastroDTO> {
    const marca = await this.localizarID(id);

    Object.entries(dados).forEach(
      ([chave, valor]) => {
          if(chave=== 'id'){
              return;
          }

          marca[chave] = valor;
      }
    )

    return this.marcaRepository.save(marca)
    .then((result) => {
      return <RetornoCadastroDTO>{
        id: marca.ID,
        message: "Marca alterada!"
      };
    })
    .catch((error) => {
      return <RetornoCadastroDTO>{
        id: "",
        message: "Houve um erro ao alterar." + error.message
      };
    });
  }
}