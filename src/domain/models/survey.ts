export interface SurveyModel{

  id: string
  question: string
  answers: SurveyAnswer[]
}

interface SurveyAnswer{
  image: string
  answer: string
}
