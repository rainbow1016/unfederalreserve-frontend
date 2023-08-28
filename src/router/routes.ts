import { Router, RouteRecordRaw } from 'vue-router';

import DashboardRoutes from '@/views/Dashboard/routes';
import LiquidatedRoutes from '@/views/Liquidated/routes';
import MarketDetailsRoutes from '@/views/MarketDetails/routes';
import MarketsRoutes from '@/views/Markets/routes';
import PoolRoutes from '@/views/Pool/routes';
import PoolPositionRoutes from '@/views/PoolPosition/routes';
import PoolLiquidityRoutes from '@/views/PoolAddLiquidity/routes';
import PoolRemoveLiquidityRoutes from '@/views/PoolRemoveLiquidity/routes';
import StaticRoutes from '@/views/Static/routes';
import HomeRoutes from '@/views/Home/routes';
import ErrorsRoutes from '@/views/Errors/routes';

type ICreateRoutesOptions = { router: Router }

export const createRoutes = (options: ICreateRoutesOptions): RouteRecordRaw[] => [
  ...DashboardRoutes(options),
  ...HomeRoutes(options),
  ...LiquidatedRoutes(options),
  ...MarketDetailsRoutes(options),
  ...MarketsRoutes(options),
  ...PoolRoutes(options),
  ...PoolPositionRoutes(options),
  ...PoolLiquidityRoutes(options),
  ...PoolRemoveLiquidityRoutes(options),
  ...StaticRoutes(options),

  // must be last, because in error - `*` route
  ...ErrorsRoutes(options),
];
