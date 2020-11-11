export interface SurveyResultModel {
  surveyId: string
  question: string
  answers: SurveyResultAnswer[]
  date: Date
}

interface SurveyResultAnswer {
  image?: string
  answer: string
  count: number
  percent: number
}
