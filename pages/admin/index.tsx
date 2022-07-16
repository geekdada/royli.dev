import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import ky from 'ky'

const RevalidateBlogPostSchema = Yup.object().shape({
  URI: Yup.string()
    .matches(/^\/blog\/\d{4}\//)
    .required('A valid URI is required'),
})

const RevalidatePageSchema = Yup.object().shape({
  URI: Yup.string()
    .matches(/^\/page\//)
    .required('A valid URI is required'),
})

const AdminHome = () => {
  return (
    <>
      <div className="container mx-auto max-w-3xl lg:max-w-5xl xl:max-w-7xl">
        <h1 className="heading-text mb-8 text-4xl font-bold font-title">
          Admin
        </h1>

        <div className="bg-white dark:bg-dark-700 drop-shadow-md rounded overflow-hidden p-8 space-y-9">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Revalidate blog post list</h2>
            <button
              className="rounded-lg px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              onClick={async () => {
                await ky.post('/api/admin/revalidate', {
                  json: {
                    type: 'blog-posts',
                  },
                })
              }}
            >
              Revalidate
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Revalidate blog post</h2>

            <Formik
              initialValues={{
                URI: '',
              }}
              validationSchema={RevalidateBlogPostSchema}
              onSubmit={async (values, actions) => {
                await ky.post('/api/admin/revalidate', {
                  json: {
                    type: 'uri',
                    uri: values.URI,
                  },
                })
                actions.resetForm()
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-3">
                  <div>
                    <Field
                      autoComplete="off"
                      className="w-full border rounded px-4 py-2 primary-text"
                      name="URI"
                      placeholder="/blog/2022/..."
                    />
                  </div>
                  {errors.URI && touched.URI ? (
                    <div className="text-red-500">{errors.URI}</div>
                  ) : null}

                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    Revalidate
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Revalidate page</h2>

            <Formik
              initialValues={{
                URI: '',
              }}
              validationSchema={RevalidatePageSchema}
              onSubmit={async (values, actions) => {
                await ky.post('/api/admin/revalidate', {
                  json: {
                    type: 'uri',
                    uri: values.URI,
                  },
                })
                actions.resetForm()
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-3">
                  <div>
                    <Field
                      autoComplete="off"
                      className="w-full border rounded px-4 py-2 primary-text"
                      name="URI"
                      placeholder="/page/..."
                    />
                  </div>
                  {errors.URI && touched.URI ? (
                    <div className="text-red-500">{errors.URI}</div>
                  ) : null}

                  <button
                    type="submit"
                    className="rounded-lg px-4 py-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  >
                    Revalidate
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminHome
