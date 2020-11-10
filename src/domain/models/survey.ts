export interface SurveyModel{
  id: string
  question: string
  answer: SurveyAnswer[]
  date: Date
}

export interface SurveyAnswer{
  image?: string
  answers: string
}
