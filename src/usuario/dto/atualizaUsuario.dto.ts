import { IsEmail, IsString } from "class-validator";
import { AlterarPessoaDTO } from "src/pessoa/dto/atualizaPessoa.dto";
import { PESSOA } from "src/pessoa/pessoa.entity";
import { EmailUnico } from "src/validacao/email-unico.validator";

export class AlterarUsuarioDTO{
   
    @IsString()
    LOGIN:string;

    @IsString()
    SENHA:string;

    @IsEmail(undefined,{message:'email inválido'})
    @EmailUnico({message:'ja existe usuario com esse email'})
    EMAIL:string;

    @IsString()
    IDPESSOA:PESSOA[];

}