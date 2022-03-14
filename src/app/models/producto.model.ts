import { environment } from "src/environments/environment";

const base_url = environment.baseUrl;

export class Producto{
  constructor(

        public titulo: string,
        public precio_ahora: string,
        public precio_antes: string,
        public info_short: string,
        public detalle: string,
        public stock: string,
        public categoria: string,
        public subcategoria: string,
        public nombre_selector: string,
        public marca: string,
        public video_review?: string,
        public _id?: string,
        public img?: string,

  ){}

  get imagenUrl(){

    if(!this.img){
      return `${base_url}/uploads/productos/no-image.jpg`;
    } else if(this.img.includes('https')){
      return this.img;
    } else if(this.img){
      return `${base_url}/uploads/productos/${this.img}`;
    }else {
      return `${base_url}/uploads/productos/no-image.jpg`;
    }

  }
}
