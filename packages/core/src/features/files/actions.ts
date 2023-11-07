"use server";
import 'server-only'
import {FileUploader} from "@1upsaas/files"

export const remove = async ({ key }: {key: string}) => {

  const f = new FileUploader({
    bucket: process.env.S3_BUCKET as string
  })

  try {
    await f.delete(key)
  } catch (error) {
    throw new Error(String(error))
  }


}