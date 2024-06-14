"use server"
export async function submitPledgeForm(prevState:  { message: string | null, error: { message: string, fieldName: string } | null}, formData: FormData) {
    console.log(formData)
    console.log(prevState)

    return {
        message: null,
        error: null,
    }
}