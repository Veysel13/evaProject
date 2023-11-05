import { PortfolioDoc } from "../../models/portfolio"
export interface InterfacePortfolio {
    gets(query:Object):Promise<PortfolioDoc[]>,
    check(userId: string,marketInstrumentId:string):void,
    buy(price: number,stock:number):void,
    sell(price: number,stock:number):void,
    canBeSold(id: string,stock:number):Promise<boolean>
  }