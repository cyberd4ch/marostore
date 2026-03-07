import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatisticsCardProps = {
  icon: ReactNode
  value: string
  title: string
  changePercentage: string
  className?: string
}

const StatisticsCard = ({ icon, value, title, changePercentage, className }: StatisticsCardProps) => {
  const isPositive = changePercentage.startsWith('+');

  return (
    <Card className={cn(
      'border border-border/20 shadow-none rounded-[2rem] bg-card/50 backdrop-blur-sm group hover:border-primary/50 transition-all overflow-hidden', 
      className
    )}>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl group-hover:scale-110 transition-transform'>
          {icon}
        </div>
        <span className='text-3xl font-funnel font-bold tracking-tight text-foreground'>{value}</span>
      </CardHeader>
      <CardContent className='flex flex-col gap-1 pb-6'>
        <span className='caption font-black uppercase tracking-widest text-muted-foreground/70 text-[10px]'>{title}</span>
        <p className='flex items-center gap-2 mt-1'>
          <span className={cn(
            'text-xs font-bold px-2 py-0.5 rounded-full',
            isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'
          )}>
            {changePercentage}
          </span>
          <span className='text-muted-foreground text-[10px] font-medium uppercase tracking-tighter italic'>vs last period</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard