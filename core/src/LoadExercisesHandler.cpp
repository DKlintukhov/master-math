/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

#include "pch.h"

#include "EventHandlers.h"
#include "Exercise.h"

namespace Core
{
    void LoadExercisesHandler(webui::window::event* event) noexcept
    {
        try
        {
            boost::json::object response;
            boost::json::array exercisesArr;

            const std::filesystem::directory_iterator dir(EXERCISES_DIR);
            for (const auto& entry : dir)
            {
                if (!entry.is_regular_file()) continue;

                const std::filesystem::path filePath = entry.path();

                if (filePath.extension() != ".json") continue;

                boost::nowide::ifstream file(filePath);
                if (!file.is_open())
                {
                    std::cerr << "Failed to open " + filePath.string() << std::endl;
                    continue;
                }

                std::string content(
                    (std::istreambuf_iterator<char>(file)),
                    std::istreambuf_iterator<char>()
                );

                try
                {
                    auto json = boost::json::parse(content);
                    const Exercise exercise(json.as_object());

                    exercisesArr.push_back(exercise.ToJson());
                }
                catch (const std::exception& e)
                {
                    std::cerr << "Failed to parse " + filePath.string() << std::endl;
                }
            }

            response["exercises"] = std::move(exercisesArr);
            event->return_string(boost::json::serialize(response));
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();

            event->return_string(boost::json::serialize(errJson));
        }
    }
}
