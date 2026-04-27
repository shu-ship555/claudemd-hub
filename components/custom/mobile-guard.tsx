export function MobileGuard() {
  return (
    <div className="lg:hidden fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-3 px-8 text-center">
      <p className="text-sm leading-[120%] tracking-[0.06em] font-bold text-foreground">PC でご覧ください</p>
      <p className="text-xs leading-[170%] tracking-[0.06em] text-muted-foreground">このページはデスクトップ（1024px 以上）向けに最適化されています。</p>
    </div>
  )
}
