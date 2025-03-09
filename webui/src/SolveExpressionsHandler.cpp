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

#include <Expression.h>
#include <ExpressionGenerator.h>
#include "EventHandlers.h"

using namespace Core;

namespace Webui
{
    void SolveExpressionsHandler(webui::window::event* event) noexcept
    {
        try
        {
            std::string jsonStr = event->get_string(0);
            boost::json::array arrayJson = boost::json::parse(jsonStr).as_array();
            boost::json::array arrayJsonResp;

            for (const auto& expr : arrayJson)
            {
                Json json = expr.as_object();
                Expression expr = ExpressionFromJson(json);
                arrayJsonResp.push_back(Evaluate(expr));
            }

           std::string serializedJson = boost::json::serialize(arrayJsonResp);

            event->return_string(serializedJson);
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();
            event->return_string(boost::json::serialize(errJson));
        }
    }
}
