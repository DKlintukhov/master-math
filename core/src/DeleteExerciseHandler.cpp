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
#include "Utf8.h"

namespace Core::EventHandlers
{
    void DeleteExerciseHandler(webui::window::event* event)
    {
        try
        {
            const boost::json::value json = boost::json::parse(event->get_string(0));
            const std::string name = json.at("name").as_string().c_str();
            
            DeleteExercise(name);

            event->return_string("{}");
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();

            event->return_string(boost::json::serialize(errJson));
        }
    }

    bool DeleteExercise(const std::string filename)
    {
        if (filename.empty()) 
            throw std::invalid_argument("Invalid filename");

        const std::wstring wfilename = Encoding::ToWide(filename);
        const std::filesystem::directory_iterator dir(EXERCISES_DIR);
        for (const auto& file : dir)
        {
            const auto& path = file.path();
            if (path.stem().filename() == wfilename)
            {
                return std::filesystem::remove(path);
            }
        }

        return false;
    }
}
