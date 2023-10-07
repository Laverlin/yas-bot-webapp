import { IWayPoint } from "./IWayPoint";

export interface IYasRoute {
    routeId: number,
    userId: number,
    routeName: string,
    routeDate: string,
    waypoints: IWayPoint[] 
}
