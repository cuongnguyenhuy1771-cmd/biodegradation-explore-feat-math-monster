import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database.types'
import type {
  CompleteBattleResult,
  ClaimDailyTaskResult,
  QuestionType,
} from '@/types/database.types'

export type Hero = Database['public']['Tables']['heroes']['Row']
export type World = Database['public']['Tables']['worlds']['Row']
export type Area = Database['public']['Tables']['areas']['Row']
export type Monster = Database['public']['Tables']['monsters']['Row']
export type Question = Database['public']['Tables']['questions']['Row']

export type LeaderboardRow = Database['public']['Views']['leaderboard']['Row'] & {
  hero_slug?: string | null
}

export type LeaderboardProfile = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'username' | 'avatar_url' | 'total_points'
> & {
  full_name?: string | null
  hero_slug?: string | null
}

export type AreaWithProgress = Area & {
  is_unlocked: boolean
  stars_earned: number
}

export type MonsterWithUnlock = Monster & {
  isUnlocked: boolean
}

export type BattleQuestion = {
  id: string
  type: QuestionType
  content: Record<string, unknown>
  hint: string | null
  difficulty: number
}

export type WorldProgressSummary = {
  totalAreas: number
  currentAreaIndex: number
  currentAreaId?: string
  currentAreaName: string
  stars: number
}

export type DailyTaskView = {
  id: string
  current_value: number
  status: 'in_progress' | 'completed' | 'claimed'
  title: string
  goal_value: number
  reward_coins: number
  reward_points: number
}

export const MathMonstersService = {
  async getHeroes(): Promise<Hero[]> {
    const { data, error } = await supabase
      .from('heroes')
      .select('*')
      .order('sort_order')
    if (error) throw error
    return data ?? []
  },

  async getHeroById(heroId: string): Promise<Hero | null> {
    const { data, error } = await supabase
      .from('heroes')
      .select('*')
      .eq('id', heroId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async getWorlds(): Promise<World[]> {
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    if (error) throw error
    return data ?? []
  },

  async getAreasByWorld(worldId: string): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('world_id', worldId)
      .order('order_index')
    if (error) throw error
    return data ?? []
  },

  async getAreasWithProgress(
    worldId: string,
    userId: string
  ): Promise<AreaWithProgress[]> {
    const [areas, progressRes] = await Promise.all([
      this.getAreasByWorld(worldId),
      supabase
        .from('user_area_progress')
        .select('area_id, is_unlocked, stars_earned')
        .eq('user_id', userId),
    ])

    if (progressRes.error) throw progressRes.error

    const progressMap = new Map(
      (progressRes.data ?? []).map((p) => [p.area_id, p])
    )

    return areas.map((area) => {
      const p = progressMap.get(area.id)
      return {
        ...area,
        is_unlocked: p?.is_unlocked ?? false,
        stars_earned: p?.stars_earned ?? 0,
      }
    })
  },

  async getAreaById(areaId: string): Promise<Area | null> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', areaId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async getBattleQuestions(areaId: string): Promise<BattleQuestion[]> {
    const { data, error } = await supabase
      .from('area_questions')
      .select('question_index, questions(id, type, content, hint, difficulty)')
      .eq('area_id', areaId)
      .order('question_index')
    if (error) throw error

    return (data ?? [])
      .map((row) => {
        const q = row.questions as BattleQuestion | BattleQuestion[] | null
        const question = Array.isArray(q) ? q[0] : q
        return question ?? null
      })
      .filter(Boolean) as BattleQuestion[]
  },

  async getMonstersWithCollection(userId: string): Promise<MonsterWithUnlock[]> {
    const [{ data: monsters, error: mErr }, { data: unlocked, error: uErr }] =
      await Promise.all([
        supabase.from('monsters').select('*').order('sort_order'),
        supabase
          .from('user_monsters')
          .select('monster_id')
          .eq('user_id', userId),
      ])

    if (mErr) throw mErr
    if (uErr) throw uErr

    const unlockedSet = new Set((unlocked ?? []).map((u) => u.monster_id))

    return (monsters ?? []).map((m) => ({
      ...m,
      isUnlocked: unlockedSet.has(m.id),
    }))
  },

  async getLeaderboard(limit = 50): Promise<LeaderboardRow[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        username,
        full_name,
        avatar_url,
        level,
        total_points,
        total_stars,
        created_at,
        hero:selected_hero_id ( slug )
      `,
      )
      .not('username', 'is', null)
      .order('total_points', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(limit)

    if (error) throw error

    return (data ?? []).map((row, index) => {
      const heroMeta = row.hero as { slug: string } | { slug: string }[] | null
      const heroSlug = Array.isArray(heroMeta) ? heroMeta[0]?.slug : heroMeta?.slug

      return {
        id: row.id,
        username: row.username,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
        level: row.level,
        total_points: row.total_points,
        total_stars: row.total_stars,
        rank: index + 1,
        hero_slug: heroSlug ?? null,
      }
    })
  },

  async getWorldById(worldId: string): Promise<World | null> {
    const { data, error } = await supabase
      .from('worlds')
      .select('*')
      .eq('id', worldId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async getWorldProgressSummary(
    worldId: string,
    userId: string
  ): Promise<WorldProgressSummary> {
    const areas = await this.getAreasWithProgress(worldId, userId)
    const unlocked = areas.filter((a) => a.is_unlocked)
    const currentArea =
      unlocked.length > 0 ? unlocked[unlocked.length - 1] : areas[0]

    return {
      totalAreas: areas.length,
      currentAreaIndex: currentArea?.order_index ?? 1,
      currentAreaId: currentArea?.id,
      currentAreaName: currentArea?.name ?? 'Khu vực 1',
      stars: currentArea?.stars_earned ?? 0,
    }
  },

  async getDailyTasks(userId: string, taskDate?: string): Promise<DailyTaskView[]> {
    const date = taskDate ?? new Date().toISOString().slice(0, 10)
    await this.initDailyTasks(userId, date)

    const { data, error } = await supabase
      .from('user_daily_tasks')
      .select('id, current_value, status, daily_tasks(title, goal_value, reward_coins, reward_points)')
      .eq('user_id', userId)
      .eq('task_date', date)
      .order('created_at')

    if (error) throw error

    return (data ?? []).map((row) => {
      const meta = row.daily_tasks as
        | {
            title: string
            goal_value: number
            reward_coins: number
            reward_points: number
          }
        | {
            title: string
            goal_value: number
            reward_coins: number
            reward_points: number
          }[]
        | null
      const task = Array.isArray(meta) ? meta[0] : meta

      return {
        id: row.id,
        current_value: row.current_value,
        status: row.status,
        title: task?.title ?? 'Nhiệm vụ',
        goal_value: task?.goal_value ?? 1,
        reward_coins: task?.reward_coins ?? 0,
        reward_points: task?.reward_points ?? 0,
      }
    })
  },

  async needsOnboarding(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed_at, selected_hero_id')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return !data?.onboarding_completed_at || !data?.selected_hero_id
  },

  async completeBattle(
    areaId: string,
    correctAnswers: number,
    totalQuestions: number,
    durationSeconds?: number,
    score?: number
  ): Promise<CompleteBattleResult> {
    const { data, error } = await supabase.rpc('complete_battle', {
      p_area_id: areaId,
      p_correct_answers: correctAnswers,
      p_total_questions: totalQuestions,
      p_duration_seconds: durationSeconds ?? null,
      p_score: score ?? 0,
    })
    if (error) throw error
    return data as unknown as CompleteBattleResult
  },

  async claimDailyTask(userDailyTaskId: string): Promise<ClaimDailyTaskResult> {
    const { data, error } = await supabase.rpc('claim_daily_task', {
      p_user_daily_task_id: userDailyTaskId,
    })
    if (error) throw error
    return data as unknown as ClaimDailyTaskResult
  },

  async initDailyTasks(userId: string, taskDate?: string) {
    const { error } = await supabase.rpc('init_user_daily_tasks', {
      p_user_id: userId,
      p_task_date: taskDate,
    })
    if (error) throw error
  },
}
