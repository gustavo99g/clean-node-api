export interface SurveyModel{
  id: string
  question: string
  answers: SurveyAnswer[]
}

export interface SurveyAnswer{
  image?: string
  answer: string
}
